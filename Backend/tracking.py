import cv2
import math
from ultralytics import YOLO
from collections import defaultdict

def analyze_traffic(video_path,
                    pixel_to_meter=0.05,
                    tailgating_thresh=10,
                    braking_thresh=8,
                    platoon_dist=15):
    """
    Corrected traffic analysis function.
    """
    model = YOLO("yolo11n.pt")
    class_list = model.names

    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)

    prev_positions = {}
    prev_speeds = {}
    vehicles_seen = {}          # track_id -> class_name
    braking_flagged = set()     # vehicles that already had hard braking
    tailgating_flagged = set()  # unique pairs (min_id,max_id) that had tailgating
    platoon_speeds = []

    frame_data = []

    frame_no = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_no += 1

        results = model.track(frame, persist=True, tracker="bytetrack.yaml")

        frame_objects = []
        vehicle_positions = []

        if results[0].boxes.data is not None:
            boxes = results[0].boxes.xyxy.cpu()
            track_ids = results[0].boxes.id.int().cpu().tolist()
            class_indices = results[0].boxes.cls.int().cpu().tolist()

            for box, track_id, class_idx in zip(boxes, track_ids, class_indices):
                x1, y1, x2, y2 = map(int, box)
                cx = (x1 + x2) // 2
                cy = (y1 + y2) // 2
                class_name = class_list[class_idx]

                vehicles_seen[track_id] = class_name

                # --- Speed calc ---
                if track_id in prev_positions:
                    px, py = prev_positions[track_id]
                    dist_px = math.sqrt((cx - px)**2 + (cy - py)**2)
                    dist_m = dist_px * pixel_to_meter
                    speed_mps = dist_m * fps
                    speed_kmh = speed_mps * 3.6
                else:
                    speed_kmh = 0.0

                # --- Hard braking check ---
                braking_flag = False
                if track_id in prev_speeds:
                    speed_drop = prev_speeds[track_id] - speed_kmh
                    if speed_drop > braking_thresh and track_id not in braking_flagged:
                        braking_flagged.add(track_id)
                        braking_flag = True

                prev_positions[track_id] = (cx, cy)
                prev_speeds[track_id] = speed_kmh

                vehicle_positions.append((track_id, cx, cy, speed_kmh, class_name))

                frame_objects.append({
                    "id": track_id,
                    "class": class_name,
                    "bbox": [x1, y1, x2, y2],
                    "center": (cx, cy),
                    "speed": speed_kmh,
                    "braking": braking_flag
                })

            # --- Tailgating check ---
            for i in range(len(vehicle_positions)):
                for j in range(i + 1, len(vehicle_positions)):
                    id1, x1, y1, v1, cname1 = vehicle_positions[i]
                    id2, x2, y2, v2, cname2 = vehicle_positions[j]
                    dist_px = math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
                    dist_m = dist_px * pixel_to_meter

                    pair = tuple(sorted([id1, id2]))
                    if dist_m < tailgating_thresh and pair not in tailgating_flagged:
                        tailgating_flagged.add(pair)
                        frame_objects.append({
                            "tailgating_pair": pair,
                            "distance": dist_m
                        })

            # --- Platoon check ---
            if len(vehicle_positions) >= 3:
                group_speeds = [v[3] for v in vehicle_positions]
                platoon_speeds.append(sum(group_speeds) / len(group_speeds))

        frame_data.append({
            "frame": frame_no,
            "objects": frame_objects
        })

    cap.release()

    # --- Summary ---
    vehicle_counts = defaultdict(int)
    for cls in vehicles_seen.values():
        vehicle_counts[cls] += 1
    vehicle_counts["total_vehicle"] = len(vehicles_seen)

    summary = {
        "hard_braking": len(braking_flagged),
        "tailgating": len(tailgating_flagged),
        "avg_platoon_speed": sum(platoon_speeds)/len(platoon_speeds) if platoon_speeds else 0,
        "vehicle_counts": dict(vehicle_counts)
    }

    return summary, frame_data

# # tailgating and hard_braking is not getting detected properly we will see that in some time don't worry 
# print(analyze_traffic('4.mp4')[0])