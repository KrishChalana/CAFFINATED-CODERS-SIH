
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_BASE = (
  (typeof window !== 'undefined' && window.__REACT_APP_API_BASE__) ||
  (typeof process !== 'undefined' && process && process.env && process.env.REACT_APP_API_BASE) ||
  'http://127.0.0.1:5000'
);

export default function VideoUpload({ChangeScreen}) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]); 
  const [inputs, setInputs] = useState({
    no_of_lanes: '',
    platoon_weight: '',
    incoming_distance: '',
    average_speed: ''
  });
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

 
  useEffect(() => {
    return () => {
      previews.forEach(p => {
        try { URL.revokeObjectURL(p.url); } catch (e) { /* ignore */ }
      });
    };
  }, [previews]);

  // Drag & drop handlers
  function handleDrop(e) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    handleNewFiles(dropped);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleFileChange(e) {
    const chosen = Array.from(e.target.files || []);
    handleNewFiles(chosen);
  }

  function handleNewFiles(newFiles) {
    setError('');
    const videoFiles = newFiles.filter(f => f && f.type && f.type.startsWith('video/'));
    if (!videoFiles.length) {
      setError('Please select video files only.');
      return;
    }

    // Combine with existing but cap at 4
    const combined = [...files, ...videoFiles].slice(0, 4);

    // Revoke previous preview urls (to avoid memory leak)
    previews.forEach(p => {
      try { URL.revokeObjectURL(p.url); } catch (e) { /* ignore */ }
    });

   
    const newPreviews = combined.map((f, i) => ({ id: `${i}_${f.name}`, name: f.name, url: URL.createObjectURL(f) }));

    setFiles(combined);
    setPreviews(newPreviews);
    setResults(null);
  }

  function removeFile(index) {
    const copyFiles = [...files];
    const copyPreviews = [...previews];

    if (copyPreviews[index]) {
      try { URL.revokeObjectURL(copyPreviews[index].url); } catch (e) { /* ignore */ }
      copyPreviews.splice(index, 1);
    }
    copyFiles.splice(index, 1);
    setFiles(copyFiles);
    setPreviews(copyPreviews.map((f, i) => ({ id: `${i}_${f.name}`, name: f.name, url: f.url })));
    setResults(null);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  }

  async function handleUploadAndProcess() {
    setError('');
    setResults(null);

    // Basic validation
    if (files.length !== 4) {
      setError('Please select exactly 4 videos.');
      return;
    }
    const required = ['no_of_lanes', 'platoon_weight', 'incoming_distance', 'average_speed'];
    for (const k of required) {
      // allow 0 value
      if (inputs[k] === '' || inputs[k] === null || typeof inputs[k] === 'undefined') {
        setError('Please fill all required parameters.');
        return;
      }
    }

    setLoading(true);

    try {
      // Rename files on client to avoid collisions: <timestamp>_<index>_<origName>
      const timestamp = Date.now();
      const renamedFiles = files.map((f, i) => {
        const safeName = f.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const newName = `${timestamp}_${i}_${safeName}`;
        return new File([f], newName, { type: f.type });
      });

      const formData = new FormData();
      renamedFiles.forEach(f => formData.append('videos', f));

      // Upload to /upload
      const uploadResp = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
      });
      const uploadJson = await uploadResp.json();

      if (!uploadResp.ok) {
        throw new Error(uploadJson.error || 'Upload failed');
      }

      // Call process with the returned filenames and parameters
      setProcessing(true);
      const processResp = await fetch(`${API_BASE}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: uploadJson.files,
          no_of_lanes: Number(inputs.no_of_lanes),
          platoon_weight: Number(inputs.platoon_weight),
          incoming_distance: Number(inputs.incoming_distance),
          average_speed: Number(inputs.average_speed)
        })
      });

      const processJson = await processResp.json();

      if (!processResp.ok) {
        throw new Error(processJson.error || 'Processing failed');
      }

      setResults(processJson);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  }

  // Small helper: nice KPI row
  function Metric({ label, value }) {
    return (
      <div className="flex flex-col items-start">
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    );
  }

  return (
    <div className="inter-font min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">TT</div>
              <div>
                <h1 className="text-2xl font-semibold">R.O.A.D.S</h1>
                <p className="text-sm text-gray-500">Upload · Analyze · Compare — modern intersection insights</p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">Intersection: <span className="font-medium">A</span></div>
        </header>

        {/* Main card with two columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Upload + inputs */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="col-span-1 md:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Upload 4 Videos</h2>
              <div className="text-sm text-gray-400">Accepted: MP4, MOV, MKV</div>
            </div>

            {/* Drag & drop area */}
            <div onDrop={handleDrop} onDragOver={handleDragOver} className="border-2 border-dashed border-gray-200 rounded-xl p-4 mb-4 hover:border-indigo-200 transition">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input ref={fileInputRef} type="file" multiple accept="video/*" onChange={handleFileChange} className="hidden" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Drag & drop up to 4 videos here or</p>
                      <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-50 text-indigo-600 text-sm font-medium hover:bg-indigo-100">
                        Select files
                      </button>
                    </div>
                    <div className="text-sm text-gray-400">{files.length}/4 selected</div>
                  </div>
                </div>
              </div>

              {/* previews */}
              {previews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {previews.map((p, idx) => (
                    <div key={p.id} className="relative bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                      <video src={p.url} className="w-full h-28 object-cover" controls />
                      <div className="p-2 flex items-center justify-between">
                        <div className="text-xs font-medium truncate">{p.name}</div>
                        <button onClick={() => removeFile(idx)} className="text-xs text-red-500 ml-2">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Parameter inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <label className="flex flex-col">
                <span className="text-xs text-gray-500"># of Lanes</span>
                <input name="no_of_lanes" value={inputs.no_of_lanes} onChange={handleInputChange} type="number" placeholder="e.g. 3" className="mt-2 p-2 rounded-md border border-gray-200" />
              </label>

              <label className="flex flex-col">
                <span className="text-xs text-gray-500">Platoon Weight</span>
                <input name="platoon_weight" value={inputs.platoon_weight} onChange={handleInputChange} type="number" placeholder="e.g. 1.5" className="mt-2 p-2 rounded-md border border-gray-200" />
              </label>

              <label className="flex flex-col">
                <span className="text-xs text-gray-500">Incoming Distance (m)</span>
                <input name="incoming_distance" value={inputs.incoming_distance} onChange={handleInputChange} type="number" placeholder="e.g. 120" className="mt-2 p-2 rounded-md border border-gray-200" />
              </label>

              <label className="flex flex-col">
                <span className="text-xs text-gray-500">Average Speed (km/h)</span>
                <input name="average_speed" value={inputs.average_speed} onChange={handleInputChange} type="number" placeholder="e.g. 45" className="mt-2 p-2 rounded-md border border-gray-200" />
              </label>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button onClick={handleUploadAndProcess} disabled={loading || processing} className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-2xl shadow-md hover:scale-[1.01] transition disabled:opacity-60">
                {loading || processing ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeLinecap="round" strokeDasharray="31.415, 31.415" fill="none"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
                <span className="font-medium">Upload & Analyze</span>
              </button>

              <button onClick={() => { previews.forEach(p => URL.revokeObjectURL(p.url)); setFiles([]); setPreviews([]); setResults(null); setError(''); }} className="px-3 py-2 border rounded-2xl text-sm">Reset</button>

              {error && <div className="ml-auto text-sm text-red-500">{error}</div>}
            </div>

            <div className="mt-4 text-xs text-gray-400">Tip: Files are renamed on upload to keep them unique. Results will show which filename corresponds to which video.</div>
          </motion.div>

          {/* Right column: Live summary / quick KPIs */}
          <motion.aside initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="col-span-1 bg-white rounded-2xl p-5 shadow-lg flex flex-col gap-4">
            <div>
              <h3 className="text-sm text-gray-500">Batch Summary</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Metric label={"Files"} value={`${files.length}/4`} />
                <Metric label={"Intersection"} value={'A'} />
                <Metric label={"Status"} value={processing ? 'Processing' : (loading ? 'Uploading' : 'Idle')} />
                <Metric label={"Last Result"} value={results ? 'Available' : '—'} />
              </div>
            </div>

            <div className="mt-2">
              <h4 className="text-sm text-gray-500">Actions</h4>
              <div className="mt-3 flex flex-col gap-2">
                <button onClick={() => results ? ChangeScreen(true): alert("First Upload The videos for analaysis")} className="text-sm px-3 py-2 border rounded-md">Open Dashboard </button>
                <a className="text-sm text-indigo-600" href="#" onClick={(e) => { e.preventDefault(); alert('Export not implemented in demo.'); }}>Export results (CSV)</a>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Results section */}
        {results && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Results — Intersection {results.intersection}</h3>
                <p className="text-sm text-gray-500">Processed videos: {results.videos_processed.join(', ')}</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-gray-400">Batch CPS (example)</div>
                  <div className="text-xl font-bold">{Object.values(results.results).reduce((acc, r) => acc + (r.cps || 0), 0).toFixed(1)}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(results.results).map(([fileName, res]) => (
                <div key={fileName} className="p-4 rounded-xl bg-gradient-to-b from-white to-gray-50 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium truncate">{fileName}</div>
                    {res.error ? (
                      <div className="text-xs text-red-500">Error</div>
                    ) : (
                      <div className="text-xs text-green-600">Done</div>
                    )}
                  </div>

                  {!res.error ? (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">Clear Time</div>
                        <div className="font-semibold">{res.t_clear}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">Traffic Score</div>
                        <div className="font-semibold">{res.traffic_score}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">Safety Penalty</div>
                        <div className="font-semibold">{res.safety_penalty ?? res.safety_penatly ?? 0}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">Green Wave Bonus</div>
                        <div className="font-semibold">{res.green_wave_bonus}</div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm text-gray-500">CPS</div>
                        <div className="text-xl font-bold">{res.cps}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-red-500">{res.error}</div>
                  )}
                </div>
              ))}
            </div>

            {/* optional detailed frames preview (collapsed) */}
            <div className="mt-6 text-sm text-gray-500">Detailed frame data is available in the raw JSON response under <code>frame_data</code>.</div>
          </motion.section>
        )}

      </div>
    </div>
  );
}
