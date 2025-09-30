# flask_server.py
from concurrent.futures import ThreadPoolExecutor, as_completed
import sys
import os
from werkzeug.utils import secure_filename
# Add parent folder (Backend/) to Python path
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(parent_dir)


from flask_cors import CORS

from green_time import total_clear_time_and_rows
from flask import Flask, request, jsonify
from tracking import analyze_traffic
from cps import calculate_traffic_score,calculate_safety_penalty,calculate_green_wave_bonus,calculate_cps
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})


def run_analysis(file_name, no_of_lanes, platoon_weight, incoming_distance, average_speed):
    """Helper that runs your original process logic on one video."""
    analyzed_traffic = analyze_traffic(f'uploads/{file_name}')
    summary, frame_data = analyzed_traffic

    t_clear = total_clear_time_and_rows(summary['vehicle_counts']['total_vehicle'], no_of_lanes)
    traffic_score = calculate_traffic_score(summary['vehicle_counts'])
    safety_penalty = calculate_safety_penalty(summary['hard_braking'], summary['vehicle_counts']['total_vehicle'])
    green_wave_bonus = calculate_green_wave_bonus(platoon_weight, incoming_distance, average_speed)
    cps = calculate_cps(traffic_score, safety_penalty, green_wave_bonus)

    response = {
        "file_name": file_name,
        "t_clear": t_clear,
        "traffic_score": traffic_score,
        "safety_penalty": safety_penalty,
        "green_wave_bonus": green_wave_bonus,
        "cps": cps,
        "frame_data": frame_data
    }

    return response

@app.route('/process', methods=['POST'])
def process():
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({'error': 'Invalid JSON format'}), 400

    # Validate input
    required_keys = ['files', 'no_of_lanes', 'platoon_weight', 'incoming_distance', 'average_speed']
    missing = [k for k in required_keys if k not in data]
    if missing:
        return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

    file_names = data["files"]
    if not isinstance(file_names, list) or len(file_names) != 4:
        return jsonify({'error': 'Exactly 4 filenames must be provided'}), 400

    no_of_lanes = data.get("no_of_lanes", 2)
    platoon_weight = data.get("platoon_weight", 1.0)
    incoming_distance = data.get("incoming_distance", 100)
    average_speed = data.get("average_speed", 40)

    results = {}
    # Run parallel analysis
    with ThreadPoolExecutor(max_workers=4) as executor:
        future_to_file = {
            executor.submit(
                run_analysis,
                fname,
                no_of_lanes,
                platoon_weight,
                incoming_distance,
                average_speed
            ): fname for fname in file_names
        }

        for future in as_completed(future_to_file):
            fname = future_to_file[future]
            try:
                results[fname] = future.result()
            except Exception as e:
                results[fname] = {"error": str(e)}

    # Final combined result for intersection A
    intersection_result = {
        "intersection": "A",
        "videos_processed": list(results.keys()),
        "results": results
    }

    return jsonify(intersection_result), 200




UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload():
    
    if 'videos' not in request.files:
        return jsonify({'error': 'No files part in the request'}), 400

    files = request.files.getlist('videos')
    if len(files) != 4:
        return jsonify({'error': 'Exactly 4 files are required'}), 400

    saved_files = []
    for idx, file in enumerate(files, start=1):
        if file.filename == '':
            return jsonify({'error': 'One of the files has no filename'}), 400

        # Normalize/secure filename
        filename = secure_filename(file.filename)
        # Rename files consistently like frontend: video1.mp4, video2.mp4, etc.
        ext = os.path.splitext(filename)[1] or '.mp4'
        final_name = f"video{idx}{ext}"
        save_path = os.path.join(UPLOAD_FOLDER, final_name)

        file.save(save_path)
        saved_files.append(final_name)

    return jsonify({
        'message': 'Files successfully uploaded',
        'files': saved_files
    }), 200






if __name__ == '__main__':
    app.run(debug=True, port=5000)
