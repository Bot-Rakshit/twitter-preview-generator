import React, { useState, useRef, useEffect } from 'react';
import { Camera, Download, User, MessageSquare, Repeat2, Heart, Share, MoreHorizontal, CheckCircle2 } from 'lucide-react';

const App = () => {
  const [profile, setProfile] = useState({
    name: 'Ishan Sukul',
    handle: 'isawsukul',
    avatar: null,
    isVerified: true
  });

  const [post, setPost] = useState({
    content: '> People saying this is "peak unemployment" really don\'t understand that most people are lonely and just want to attach themselves to a community / individuals with similar taste\n> Loneliness is a real thing and these sort of events really bring people together, we need a lot more of these\n> Sitting terminally online and calling ourselves productive is equally bad, if not worse\n> Yes anon, this is that deep\n> Nothing, Bluorng, Jaywalking...loving the cult-ness that\'s being built in India',
    image: null,
    timestamp: '2:37 PM · Feb 15, 2026',
    views: '6,604'
  });

  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const previewRef = useRef(null);

  // Load dom-to-image from CDN to handle the screenshot functionality
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js";
    script.async = true;
    script.onload = () => setIsLibraryLoaded(true);
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleImageUpload = (e, target) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (target === 'avatar') {
          setProfile({ ...profile, avatar: event.target.result });
        } else {
          setPost({ ...post, image: event.target.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = () => {
    if (!previewRef.current || !window.domtoimage) {
      console.error("Library not loaded or element missing");
      return;
    }
    
    // Scale up for better quality
    const scale = 2;
    const options = {
      height: previewRef.current.offsetHeight * scale,
      width: previewRef.current.offsetWidth * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${previewRef.current.offsetWidth}px`,
        height: `${previewRef.current.offsetHeight}px`
      }
    };

    window.domtoimage.toPng(previewRef.current, options)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `tweet-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Error generating image:', err);
      });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Editor Panel */}
        <div className="space-y-6 bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 h-fit">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-400" /> Twitter Preview Creator
            </h2>
            <div className={`text-[10px] px-2 py-1 rounded ${isLibraryLoaded ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {isLibraryLoaded ? 'System Ready' : 'Loading Engine...'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Display Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full bg-black border border-neutral-700 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-neutral-500 text-sm">@</span>
                <input 
                  type="text" 
                  value={profile.handle}
                  onChange={(e) => setProfile({...profile, handle: e.target.value})}
                  className="w-full bg-black border border-neutral-700 rounded-lg p-2 pl-7 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-400">Post Content (No Limit)</label>
            <textarea 
              rows={6}
              value={post.content}
              onChange={(e) => setPost({...post, content: e.target.value})}
              className="w-full bg-black border border-neutral-700 rounded-lg p-3 focus:ring-1 focus:ring-blue-500 outline-none resize-none text-sm"
              placeholder="What's happening?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Profile Picture</label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-neutral-700 rounded-xl cursor-pointer hover:bg-neutral-800 transition-colors">
                <User className="w-6 h-6 text-neutral-500 mb-1" />
                <span className="text-[10px] text-neutral-500">Change DP</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
              </label>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Post Image</label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-neutral-700 rounded-xl cursor-pointer hover:bg-neutral-800 transition-colors">
                <Camera className="w-6 h-6 text-neutral-500 mb-1" />
                <span className="text-[10px] text-neutral-500">Add Picture</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'postImage')} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Timestamp</label>
              <input 
                type="text" 
                value={post.timestamp}
                onChange={(e) => setPost({...post, timestamp: e.target.value})}
                className="w-full bg-black border border-neutral-700 rounded-lg p-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Views</label>
              <input 
                type="text" 
                value={post.views}
                onChange={(e) => setPost({...post, views: e.target.value})}
                className="w-full bg-black border border-neutral-700 rounded-lg p-2 text-sm"
              />
            </div>
          </div>

          <button 
            onClick={downloadImage}
            disabled={!isLibraryLoaded}
            className={`w-full py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${
              isLibraryLoaded ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <Download className="w-5 h-5" /> Download Image
          </button>
        </div>

        {/* Live Preview Panel */}
        <div className="flex flex-col items-center">
          <div className="sticky top-8 w-full max-w-[500px]">
            <h2 className="text-[10px] font-bold text-neutral-500 mb-4 uppercase tracking-[0.2em] text-center">Live Rendering Preview</h2>
            
            <div 
              ref={previewRef}
              className="bg-black w-full border border-neutral-800 overflow-hidden"
            >
              <div className="p-4">
                {/* User Header */}
                <div className="flex items-start justify-between mb-1">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 overflow-hidden flex-shrink-0">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                          <User className="text-neutral-600 w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col leading-tight pt-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[15px]">{profile.name}</span>
                        {profile.isVerified && (
                          <CheckCircle2 className="w-[18px] h-[18px] text-blue-500 fill-blue-500" />
                        )}
                      </div>
                      <span className="text-neutral-500 text-[15px]">@{profile.handle}</span>
                    </div>
                  </div>
                  <MoreHorizontal className="text-neutral-500 w-5 h-5 mt-1" />
                </div>

                {/* Text Content */}
                <div className="text-[15px] leading-normal whitespace-pre-wrap break-words mt-3 mb-4 font-sans tracking-tight">
                  {post.content}
                </div>

                {/* Post Media */}
                {post.image && (
                  <div className="mt-3 mb-4 rounded-2xl border border-neutral-800 overflow-hidden">
                    <img src={post.image} alt="post" className="w-full h-auto max-h-[600px] object-contain bg-black" />
                  </div>
                )}

                {/* Timestamp & Stats */}
                <div className="flex items-center gap-1.5 text-neutral-500 text-[15px] py-4 border-b border-neutral-800">
                  <span>{post.timestamp}</span>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-white">{post.views}</span>
                    <span>Views</span>
                  </div>
                </div>

                {/* Icons Bar */}
                <div className="flex justify-between items-center text-neutral-500 py-2 px-1">
                  <MessageSquare className="w-[18px] h-[18px]" />
                  <Repeat2 className="w-[18px] h-[18px]" />
                  <Heart className="w-[18px] h-[18px]" />
                  <Share className="w-[18px] h-[18px]" />
                </div>
              </div>
            </div>
            
            <p className="mt-6 text-[10px] text-neutral-700 text-center uppercase tracking-widest leading-relaxed">
              Designed for Pixel Precision <br/>
              Custom-built Preview Engine <br/>
              <span className="text-blue-500">Made by Rakshit Singh</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
