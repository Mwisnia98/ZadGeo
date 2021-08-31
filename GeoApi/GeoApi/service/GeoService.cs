
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using OSGeo.GDAL;
using OSGeo.OGR;
using OSGeo.OSR;
using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace GeoApi.service
{
    public interface IGeoService
    {
        Task<object> getGeoJson(List<IFormFile> files);
    }
    public class GeoService : IGeoService
    {


        public async Task<object> getGeoJson(List<IFormFile> files)
        {


                Directory.CreateDirectory("tempDir");
                var tempFiles = new TempFileCollection("tempDir", false);
                    foreach (var file in files)
                    {//Create directory if it doesn't exist 

                    string name = @$"{tempFiles.TempDir}\{file.FileName}";
                     tempFiles.AddFile(name, false);

                    FileStream fs2 = File.OpenWrite(name);
                    await file.CopyToAsync(fs2);
                    fs2.Close();

            }

                Ogr.RegisterAll();
                var drv = Ogr.GetDriverByName("ESRI Shapefile");
                var ds = drv.Open(tempFiles.TempDir, 0);
                OSGeo.OGR.Layer layer = ds.GetLayerByIndex(0);

            var crsProp = layer.GetSpatialRef().GetAttrValue("AUTHORITY", 1);
            var crsname = layer.GetSpatialRef().GetAttrValue("AUTHORITY", 0);
            var projection = $"{crsname}:{crsProp}";



            OSGeo.OGR.Feature f;
                layer.ResetReading();

                System.Text.StringBuilder sb = new System.Text.StringBuilder();
                sb.AppendLine("{\"type\":\"FeatureCollection\",\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\""+projection + "\"}}, \"features\":[");
                while ((f = layer.GetNextFeature()) != null)
                {
                    //Geometry
                    var geom = f.GetGeometryRef();
                    if (geom != null)
                    {
                        var geometryJson = geom.ExportToJson(new string[] { });
                        sb.Append("{\"type\":\"Feature\", \"geometry\":" + geometryJson + "}");
                    }

                    //Properties
                    int count = f.GetFieldCount();
                    if (count != 0)
                    {
                     sb = sb.Remove(sb.Length-1,1);
                        sb.Append(",\"properties\":{");
                        for (int i = 0; i < count; i++)
                        {
                            FieldType type = f.GetFieldType(i);
                            string key = f.GetFieldDefnRef(i).GetName();

                            if (type == FieldType.OFTInteger)
                            {
                                var field = f.GetFieldAsInteger(i);
                                var tostring = $"\"{key}\":\"{field}\"";
                                sb.Append( tostring + ",");
                        }
                            else if (type == FieldType.OFTReal)
                            {
                                var field = f.GetFieldAsDouble(i);
                            var tostring = $"\"{key}\":\"{field}\"";
                            sb.Append(tostring + ",");
                        }
                            else
                            {
                                var field = f.GetFieldAsString(i);
                            var tostring = $"\"{key}\":\"{field}\"";
                            sb.Append(tostring + ",");
                        }

                        }
                        sb.Length--;
                        sb.Append("}");
                    }

                //FID
                /*long id = f.GetFID();
                sb.AppendLine("\"id\":" + id + "},");*/
                sb.AppendLine("},");
                }


            sb.Length -= 3;
            sb = sb.Remove(sb.Length - 2, 1);


            sb.AppendLine("");
                sb.Append("}]}");



            
            var res = sb.ToString();
            sb.Clear();

            

            layer.Dispose();
            ds.Dispose();
            drv.Dispose();

            tempFiles.KeepFiles = false;
            tempFiles.Delete();


            var outres = res.Replace(System.Environment.NewLine, string.Empty).Replace(@"\", string.Empty);

            return outres;


        }





    }
}
