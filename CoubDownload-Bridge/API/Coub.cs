using GcmSharp.Serialization;
using Newtonsoft.Json;
using QuickType;
using RestSharp;
using RestSharp.Serialization.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoubDownload_Bridge.API
{
    public class Coub
    {
        private RestClient client { get; set; }
        public Coub()
        {
            this.client = new RestClient("https://coub.com/api/v2");
            this.client.AddHandler("application/json", () => NewtonsoftJsonSerializer.Default);
            this.client.AddHandler("text/json", () => NewtonsoftJsonSerializer.Default);
            this.client.AddHandler("text/x-json", () => NewtonsoftJsonSerializer.Default);
            this.client.AddHandler("text/javascript", () => NewtonsoftJsonSerializer.Default);
            this.client.AddHandler("*+json", () => NewtonsoftJsonSerializer.Default);
        }
        public async Task<CoubModel> getCoubById(string id)
        {
            var req = new RestRequest("coubs/{id}.json", Method.GET);
            req.AddUrlSegment("id", id);
            var r = this.client.Execute<CoubModel>(req);
            return r.Data;
            //return JsonConvert.DeserializeObject<CoubModel>(this.client.Get(req).Content);
        }
    }

}
