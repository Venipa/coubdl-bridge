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
    public class Config
    {
        public Config() { }
        // Config Section

        [JsonProperty("silentProcessOnUrlScheme")]
        public bool silentWebProcessing { get; private set; } = false;
        [JsonProperty("copyFileToClipboard")]
        public bool copyFileToClipboard { get; private set; } = false;
        [JsonProperty("spanVideoToAudio")]
        public bool spanVideoToAudio { get; private set; } = false;
        [JsonProperty("useSinglePalletePerFrame")]
        public bool useSinglePalletePerFrame { get; private set; } = false;
        [JsonProperty("gifWidth")]
        public int gifWidth { get; set; } = 320;

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
