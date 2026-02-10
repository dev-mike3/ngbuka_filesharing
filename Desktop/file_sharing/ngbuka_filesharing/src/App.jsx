import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";



const SUPABASE_URL = "https://maosnbctqmhpesyqrxua.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hb3NuYmN0cW1ocGVzeXFyeHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzc4MDMsImV4cCI6MjA3OTIxMzgwM30.vP40pyA6_hoXuXS8EzhPpQbR7gTDh81FPAB29IpT-rg";

const CLOUDINARY_CLOUD_NAME = "dnwzodfab";
const CLOUDINARY_UPLOAD_PRESET = "unsigned";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);





function Sidebar({ user }) {
  const [role, setRole] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchRole = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (error) throw error;
        setRole(data?.role || "Staff");
      } catch (err) {
        console.warn("Fetch role error:", err);
        setRole("Staff");
      }
    };
    fetchRole();
  }, [user]);

  const roleLabel = role === "superadmin" ? "Superadmin" : "Staff";

  return (
    <>

    <button
  className={`md:hidden fixed top-4 left-4 z-50 bg-[#1A1A7A] text-white p-2 rounded-lg shadow-xl 
    ${isOpen ? "hidden" : "block"}`}
  onClick={() => setIsOpen(!isOpen)}
>
  ☰
</button>




      <div
        className={`
          fixed md:relative w-64  bg-[#1A1A7A] text-white p-4 flex flex-col justify-between
          h-full md:h-auto 
          transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:flex 
        `}
      >
        <div>

          <div className="mb-8 hidden md:block">
            <h2 className="text-xl font-bold text-white">Menu</h2>
          </div>
          <nav className="flex-1">
            
            <div className="mb-6">
            
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/upload"
                    className="flex items-center p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3">⬆️</span> Upload
                  </Link>
                </li>
                <li>
                  <Link
                    to="/files"
                    className="flex items-center p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3">📥</span> Received
                  </Link>
                </li>
              </ul>
            </div>

            
            <div>
              <p className="text-gray-400 text-sm mb-2">External Links</p>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://app.ngbuka.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3">🌐</span> Ngbuka
                  </a>
                </li>
                <li>
                  <a
                    href="https://forum.ngbuka.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3">📝</span> Ngbuka Forum
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="border-t border-gray-600 pt-4 mt-4 text-center break-words">
          {user ? (
            <>
              <p className="font-semibold text-white break-words">{user.email}</p>
              <p className="text-sm text-gray-300">{roleLabel}</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-white">Guest</p>
              <p className="text-sm text-gray-300">Staff</p>
            </>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}


function Header({ user, onSignOut }) {
  return (
    <header className="bg-[#FF8E05] h-[8vh] shadow-xl flex items-center px-4 md:px-6 w-full">
      
      <Link to="/" className="ml-12 md:ml-0">
        <img src="/bluelogo.png" alt="Logo" className="h-10 w-auto cursor-pointer" />
      </Link>
      <div className="flex-1 flex justify-center">
        
        <div className="text-center font-bold italic text-blue-900 text-xl md:text-3xl break-words hidden md:block">
          Team File Sharing
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4 flex-wrap md:flex-nowrap">
        {user ? (
          <>
            <div className="text-sm md:text-base truncate max-w-[80px] md:max-w-full">
              <div className="font-semibold">{user.email}</div>
            </div>
            <button
              className="bg-red-500 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm whitespace-nowrap"
              onClick={onSignOut}
            >
              Sign out
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="bg-blue-700 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}




function AuthPage({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;
      alert("Sign up successful! Please verify your email.");
      setEmail("");
      setPassword("");
      setIsSignUp(false);
      navigate("/auth");
    } catch (err) {
      alert(err.message || JSON.stringify(err));
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onAuthSuccess(data.user);
      navigate("/");
    } catch (err) {
      alert(err.message || JSON.stringify(err));
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <div className="bg-white p-6 md:p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">
          {isSignUp ? "Create an account" : "Sign in"}
        </h2>
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>





          <div className="flex items-center border rounded overflow-hidden">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter your password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="flex-1 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="px-3 text-gray-500 hover:text-gray-700"
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>







          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto hover:bg-blue-700"
            >
              {isSignUp ? "Sign up" : "Sign in"}
            </button>
            <button
              type="button"
              className="text-sm text-blue-600 underline"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Already have an account?" : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}







function HomePage() {
  return (
    <div className="max-w-4xl mx-auto text-center mt-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Welcome to Team File Sharing</h1>
      <p className="text-gray-600">Use the menu to upload or view files. Sign in to enable sharing.</p>
    </div>
  );
}










function UploadPage({ user }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();

  
  const generateThumbnail = (file) =>
    new Promise((resolve) => {
      const url = URL.createObjectURL(file);

      if (file.type.startsWith("image/")) {
        resolve(url);
        return;
      }

      if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = url;
        video.muted = true;

        video.addEventListener("loadeddata", () => {
          video.currentTime = 0.2;
        });

        video.addEventListener("seeked", () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/png"));
        });

        return;
      }

      resolve(null);
    });

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);

    const thumbs = await Promise.all(fileArray.map(generateThumbnail));
    setThumbnails(thumbs);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.secure_url || null;
    } catch (err) {
      console.error("Cloudinary error:", err);
      return null;
    }
  };

  const handleUpload = async () => {
    if (!user) return alert("Please sign in to upload.");
    if (selectedFiles.length === 0) return alert("Please select files first.");
    setUploading(true);

    try {
      const urls = await Promise.all(selectedFiles.map(uploadToCloudinary));

      const records = urls
        .map((url, i) =>
          url
            ? {
                file_name: selectedFiles[i].name,
                file_url: url,
                file_size: selectedFiles[i].size, 
                uploaded_by: user.id,
                uploaded_by_email: user.email || null,
                shared_with: [],
                last_commented_at: null,
              }
            : null
        )
        .filter(Boolean);

      if (records.length === 0) {
        alert("No files uploaded (Cloudinary failed).");
        setUploading(false);
        return;
      }

      const { data, error } = await supabase.from("files").insert(records).select();
      if (error) throw error;

      setSelectedFiles([]);
      setThumbnails([]);
      if (inputRef.current) inputRef.current.value = "";
      navigate("/files");
    } catch (err) {
      console.error("Upload/Insert error:", err);
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="px-4">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Upload Files</h1>
        <p className="text-gray-600">Choose recipients and upload files to share with your team</p>
      </div>

      <div
        className="bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 p-6 md:p-8 mb-8"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl md:text-4xl">📁</span>
          </div>

          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">Drag & Drop your files</h3>
          <p className="text-gray-500 mb-6">or click to browse your device</p>

          <label
            htmlFor="file-upload"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 md:px-8 rounded-lg cursor-pointer flex items-center justify-center mx-auto mb-4"
          >
            <span className="mr-2">📎</span> Choose Files
          </label>
          <input
            ref={inputRef}
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
          />

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 md:px-8 rounded-lg w-full md:w-auto"
          >
            {uploading ? "Uploading..." : "Upload and share"}
          </button>

          {selectedFiles.length > 0 && (
            <div className="mt-6 max-w-xl mx-auto text-left">
              <h4 className="font-semibold text-gray-800 mb-3">Preview:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="border rounded-lg p-2">
                    {thumbnails[i] ? (
                      <img
                        src={thumbnails[i]}
                        className="w-full h-32 object-cover rounded"
                        alt="preview"
                      />
                    ) : (
                      <div className="text-gray-600 text-sm">{file.name}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


const formatBytes = (bytes, decimals = 2) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};






function ReceivedFilesPage({ user }) {
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({});
  const [sidebarFile, setSidebarFile] = useState(null);
  const channelRef = useRef(null);
  const sidebarRef = useRef(null);
  

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: filesData, error: filesError } = await supabase
          .from("files")
          .select("*")
          .order("inserted_at", { ascending: false });

        if (filesError) throw filesError;

        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select("*");

        if (commentsError) throw commentsError;

        const grouped = {};
        (commentsData || []).forEach((c) => {
          grouped[c.file_id] = grouped[c.file_id] || [];
          grouped[c.file_id].push(c);
        });

        if (!mounted) return;
        setFiles(filesData || []);
        setComments(grouped);
      } catch (err) {
        console.error("fetchData error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    const ch = supabase
      .channel("comments_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        (payload) => {
          const newC = payload.new;
          setComments((prev) => ({
            ...prev,
            [newC.file_id]: [...(prev[newC.file_id] || []), newC],
          }));
        }
      )
      .subscribe();

    channelRef.current = ch;

    return () => {
      mounted = false;
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [user]);

  const forceDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download file.");
    }
  };

  const handleDelete = async (file) => {
    if (file.uploaded_by !== user.id) {
      alert("You can only delete files you uploaded.");
      return;
    }
    if (!window.confirm(`Delete "${file.file_name}"?`)) return;

    try {
      const { error } = await supabase.from("files").delete().eq("id", file.id);
      if (error) throw error;

      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      setComments((prev) => {
        const copy = { ...prev };
        delete copy[file.id];
        return copy;
      });
      if (sidebarFile?.id === file.id) setSidebarFile(null);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const addCommentToDB = async ({ fileId, text }) => {
    const now = new Date().toISOString();
    const payload = {
      file_id: fileId,
      comment_text: text,
      created_by: user.id,
      created_by_email: user.email,
      created_at: now,
    };
    const { data, error } = await supabase.from("comments").insert(payload).select().single();
    if (error) throw error;
    return data;
  };

  const handleAddComment = async (fileId) => {
    if (!newComment[fileId] || newComment[fileId].trim() === "") return;
    const text = newComment[fileId].trim();
    setNewComment((p) => ({ ...p, [fileId]: "" }));

    try {
      const inserted = await addCommentToDB({ fileId, text });
      setComments((prev) => ({
        ...prev,
        [fileId]: [...(prev[fileId] || []), inserted],
      }));
    } catch (err) {
      console.error("Failed adding comment:", err);
    }
  };

  if (!user) return <div className="p-4">Please sign in to see files.</div>;
  if (loading) return <div className="p-4">Loading files...</div>;
  if (files.length === 0) return <div className="p-4">No files uploaded yet.</div>;

  return (
    <div className="flex flex-col md:flex-row gap-4 relative px-4 md:px-0">

      {/* FILE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {files.map((file) => (
          <div
            key={file.id}
            className="relative bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => setSidebarFile(file)}
          >
            {/* Preview */}
            {/\.(jpg|jpeg|png|gif)$/i.test(file.file_name) && (
              <img src={file.file_url} alt={file.file_name || ""} className="w-full h-40 object-cover rounded mb-2" />
            )}
            {/\.(mp4|webm|ogg)$/i.test(file.file_name) && (
              <video controls className="w-full h-40 rounded mb-2">
                <source src={file.file_url} type="video/mp4" />
              </video>
            )}
            {!/\.(jpg|jpeg|png|gif|mp4|webm|ogg)$/i.test(file.file_name) && (
              <p className="text-blue-600 underline break-words">{file.file_name}</p>
            )}

            <p className="text-xs text-gray-500 mt-2 pb-5 pr-5 break-words">
              Uploaded by: {file.uploaded_by_email || file.uploaded_by} <br />
              {file.inserted_at ? new Date(file.inserted_at).toLocaleString() : ""} <br />
              Size: {formatBytes(file.file_size)}
            </p>

            {/* Icons */}
            <div className="absolute left-0 right-0 bottom-2 flex justify-center gap-3 flex-wrap">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  forceDownload(file.file_url, file.file_name);
                }}
                className="hover:bg-white px-2 py-1 shadow flex items-center justify-center bg-blue-600 text-xs"
                title="Download"
              >
                Download
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(file);
                }}
                className={`px-2 py-1 shadow flex items-center justify-center text-xs ${
                  file.uploaded_by === user.id ? "bg-red-600 hover:bg-white" : "bg-gray-300 cursor-not-allowed"
                }`}
                title={file.uploaded_by === user.id ? "Delete" : "Cannot delete"}
                disabled={file.uploaded_by !== user.id}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>


      {sidebarFile && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/10" onClick={() => setSidebarFile(null)}></div>

          <div
            ref={sidebarRef}
            className="absolute right-0 top-0 h-screen w-full sm:w-96 bg-white shadow-xl p-4 flex flex-col z-50 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg break-words">{sidebarFile.file_name}</h3>
              <button onClick={() => setSidebarFile(null)} className="text-red-500 text-xl font-bold hover:text-red-700">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto border rounded p-2 bg-gray-50">
              {(comments[sidebarFile.id] || []).map((c) => (
                <div key={c.id} className="border-b py-2 text-sm flex justify-between items-center break-words">
                  <div>
                    <strong>{c.created_by_email}: </strong>
                    {c.comment_text}
                  </div>
                  {c.created_by === user.id && (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!window.confirm("Delete your comment?")) return;
                        try {
                          const { error } = await supabase.from("comments").delete().eq("id", c.id);
                          if (error) throw error;
                          setComments((prev) => ({
                            ...prev,
                            [sidebarFile.id]: prev[sidebarFile.id].filter((com) => com.id !== c.id),
                          }));
                        } catch (err) {
                          console.error("Delete comment failed:", err);
                          alert("Failed to delete comment.");
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-xs ml-2"
                      title="Delete your comment"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newComment[sidebarFile.id] || ""}
                onChange={(e) =>
                  setNewComment((prev) => ({ ...prev, [sidebarFile.id]: e.target.value }))
                }
                placeholder="Add a comment..."
                className="flex-1 border rounded px-2 py-1 text-sm"
              />
              <button
                onClick={() => handleAddComment(sidebarFile.id)}
                className="bg-green-600 text-white px-3 py-1 rounded whitespace-nowrap"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}








export default function App() {
const [user, setUser] = useState(null);
  useEffect(() => {
    let mounted = true;
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (mounted) setUser(data?.user || null);
      } catch (e) {
        console.warn("getUser error", e);
      }
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      mounted = false;
      try { listener?.subscription?.unsubscribe(); } catch (e) {}
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar user={user} />
        <div className="flex-1 flex flex-col md:ml-0 transition-all duration-300">
          <Header user={user} onSignOut={handleSignOut} />
          <main className="flex-1 p-4 md:p-6 bg-gray-100 overflow-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage onAuthSuccess={setUser} />} />
              <Route path="/upload" element={<UploadPage user={user} />} />
              <Route path="/files" element={<ReceivedFilesPage user={user} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}












