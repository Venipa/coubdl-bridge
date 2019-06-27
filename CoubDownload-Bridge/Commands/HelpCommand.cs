using Consolas.Core;
using CoubDownload_Bridge.Args;

namespace CoubDownload_Bridge.Commands
{
    public class HelpCommand : Command
    {
        public string Execute(HelpArgs args)
        {
            return "Using: CoubDownload_Bridge.exe ...";
        }
    }
}