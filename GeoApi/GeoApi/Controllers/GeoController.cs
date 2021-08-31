using GeoApi.service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GeoApi.Controllers
{
    [ApiController]
    [Route("import")]
    public class GeoController : ControllerBase
    {
        private readonly IGeoService _service;

        public GeoController(IGeoService service)
        {
            _service = service;
        }



        [HttpPost]
        public async Task<IActionResult> ImportFile([FromForm]List<IFormFile> files)
        {

            var result = await _service.getGeoJson(files);




            return Ok(result.ToString());
        }



    }
}
