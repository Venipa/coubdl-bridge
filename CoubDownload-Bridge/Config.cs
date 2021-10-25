using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace CoubDownload_Bridge
{
    public class SharexConfig
    {
        [JsonProperty("enabled")]
        public bool Enabled { get; private set; } = false;
        [JsonProperty("path")]
        public string Path { get; private set; } = "";
        [JsonProperty("task")]
        public string TaskName { get; private set; } = "";
    }
    public class GifGenerationConfig {
        
        const int MAX_QUALITY = 100;
        const int MIN_QUALITY = 10;
        const int MAX_FPS = 60;
        const int MIN_FPS = 10;
        private int? _Fps;
        [JsonProperty("fps")]
        public int? Fps
        {
            get { return _Fps; }
            set
            {
                if (value == null)
                {
                    _Fps = null;
                    return;
                }
                _Fps = value < MIN_FPS ? MIN_FPS :
          value > MAX_FPS ? MAX_FPS : value;
            }
        }
        
        public int MaxFps { get; set; } = 100;
        private int _quality;
        [JsonProperty("quality")]
        public int Quality
        {
            get { return _quality; }
            set { _quality = value < MIN_QUALITY ? MIN_QUALITY :
            value > MAX_QUALITY ? MAX_QUALITY : value; }
        }
        [JsonProperty("width")]
        public int? Width { get; set; }
        [JsonProperty("height")]
        public int? Height { get; set; }
        [JsonProperty("match_aspect_ratio")]
        public bool MatchAspectRatio { get; set; } = true;
    }
    public class Config
    {
        public Config() { }
        // Config Section

        [JsonProperty("sharex")]
        public SharexConfig Sharex{ get; private set; } = new SharexConfig();
        [JsonProperty("silentProcessOnUrlScheme")]
        public bool silentWebProcessing { get; private set; } = false;
        [JsonProperty("moveNsfwToNewFolder")]
        public bool nsfwFolderEnabled { get; set; } = true;
        [JsonProperty("moveMediaToTheirCategoryFolder")]
        public bool categoryToFolderMatchEnabled { get; set; } = false;
        [JsonProperty("copyFileToClipboard")]
        public bool copyFileToClipboard { get; private set; } = false;
        [JsonProperty("spanVideoToAudio")]
        public bool spanVideoToAudio { get; private set; } = false;
        [JsonProperty("loopCountFallback")]
        public int? LoopCountFallback { get; set; } = 5;
        [JsonProperty("useSinglePalletePerFrame")]
        public bool useSinglePalletePerFrame { get; private set; } = false;
        [JsonProperty("addCategoryPrefix")]
        public bool addCategoryPrefix { get; private set; } = true;
        [JsonProperty("addCommunityPrefix")]
        public bool addCommunityPrefix { get; private set; } = false;
        [JsonProperty("customFilenameFormat")]
        public string customFilenameFormat { get; private set; } = "[%category%]%id%";
        [JsonProperty("gifWidth")]
        public int gifWidth { get; set; } = 320;
        [JsonProperty("additional_gif_conversions")]
        public List<GifGenerationConfig> AdditionalGIFConversions { get; set; } = new List<GifGenerationConfig>();

        [JsonProperty("outputPath")]
        public string outputPath { get; private set; } = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "output");

        // Config Section End
        [JsonIgnore]
        private string configPath { get => Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "config.json"); }
        public Config Load()
        {
            var config = JsonConvert.DeserializeObject<Config>(File.ReadAllText(this.configPath));
            var _self = this.GetType();
            config.GetType().GetProperties().Where(x => x.GetCustomAttribute<JsonIgnoreAttribute>() == null && x.GetCustomAttribute<JsonPropertyAttribute>() != null).ToList().ForEach(x =>
            {
                _self.GetProperty(x.Name).SetValue(this, x.GetValue(config));
            });
            this.Save();
            return this;
        }
        public bool Exists()
        {
            return File.Exists(this.configPath);
        }
        public void Save()
        {
            File.WriteAllText(this.configPath, JsonConvert.SerializeObject(this, Formatting.Indented));
        }
    }
}
