﻿using CoubDownload_Bridge.API;
using CoubDownload_Bridge.Commands;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoubDownload_Bridge.Tests
{
    [TestFixture]
    public class DownloadTest
    {
        [Test]
        public void ExecuteDownloadTest()
        {
            var result = new DownloadCommand().Execute(new Args.DownloadArgs() { download = "coubdl-bridge://1p3kmd" });
            Assert.AreEqual(true, File.Exists(result));
        }
    }
}
