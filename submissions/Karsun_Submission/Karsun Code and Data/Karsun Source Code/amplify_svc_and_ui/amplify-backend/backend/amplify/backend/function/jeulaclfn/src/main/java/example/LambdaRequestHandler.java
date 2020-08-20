/* Amplify Params - DO NOT EDIT
	STORAGE_EULACLASS_BUCKETNAME
Amplify Params - DO NOT EDIT */

package example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.github.openjson.JSONObject;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.ToXMLContentHandler;
import org.xml.sax.ContentHandler;
import org.xml.sax.SAXException;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.sagemakerruntime.SageMakerRuntimeClient;
import software.amazon.awssdk.services.sagemakerruntime.model.*;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class LambdaRequestHandler implements RequestHandler<Map<String,Object>, ResponseClass> {
    Gson gson = new GsonBuilder().setPrettyPrinting().create();

    public ResponseClass handleRequest(Map<String,Object> request, Context context){
        String resp = "";
        String jsonStr = gson.toJson(request);
        JsonObject convertedObject = gson.fromJson(jsonStr, JsonObject.class);
        String body = convertedObject.get("body").getAsString();

        JsonObject bodyObj = gson.fromJson(body, JsonObject.class);

        S3Client s3 = S3Client.builder()
                .region(Region.US_EAST_1)
                .build();
        String bucketName = System.getenv("STORAGE_EULACLASS_BUCKETNAME");
        //String bucketName = "eula-classifier2aa6b6bbf6c24845848047834e2e24b9dev-dev";
        System.out.println(bucketName + "/public/" + bodyObj.get("filename").getAsString());
        InputStream inputStream = getObjectBytes(s3, bucketName, "public/" + bodyObj.get("filename").getAsString());

        ContentHandler handler =new ToXMLContentHandler();
        Metadata metadata = new Metadata();

        ParseContext pcontext = new ParseContext();

        //parsing the document using PDF parser
        AutoDetectParser parser = new AutoDetectParser();
        try {
            parser.parse(inputStream, handler, metadata, pcontext);

            //getting the content of the document

            SAXParserFactory factory = SAXParserFactory.newInstance();
            SAXParser saxParser = factory.newSAXParser();
            ClauseDocSaxParser saxHandler = new ClauseDocSaxParser();
            InputStream stream = new ByteArrayInputStream(handler.toString().getBytes(StandardCharsets.UTF_8));
            saxParser.parse(stream, saxHandler);

            ClauseDoc doc = saxHandler.getClauseDoc();

            SageMakerRuntimeClient sageMakerRuntimeClient = SageMakerRuntimeClient.builder()
                    .region(Region.US_EAST_1)
                    .build();

            for(DocSection section : doc.getSections()) {
                List<String> predictions = new ArrayList<>();
                for (String clause : section.getClauses()) {

                    JSONObject json = new JSONObject();
                    json.put("text", clause);

                    InvokeEndpointRequest invokeEndpointRequest = InvokeEndpointRequest.builder()
                            .accept("application/json")
                            .contentType("application/json")
                            .endpointName(System.getenv("SM_MODEL_NAME"))
                            .body(SdkBytes.fromUtf8String(json.toString()))
                            .build();

                    InvokeEndpointResponse response = sageMakerRuntimeClient.invokeEndpoint(invokeEndpointRequest);

                    predictions.add(new String(response.body().asByteArray()));
                }

                section.setPredictions(predictions);
            }

            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
            resp = ow.writeValueAsString(doc);

        } catch (SAXException e) {
            e.printStackTrace();
        }
        catch (IOException e) {
            e.printStackTrace();
        }
        catch (TikaException | ParserConfigurationException e) {
            e.printStackTrace();
        }

        ResponseBuilder builder = new ResponseBuilder();
        ResponseClass responseClass = builder.ok().body(resp).build();

        return responseClass;
    }

    public static InputStream getObjectBytes (S3Client s3, String bucketName, String keyName) {

        try {
            // create a GetObjectRequest instance
            GetObjectRequest objectRequest = GetObjectRequest
                    .builder()
                    .key(keyName)
                    .bucket(bucketName)
                    .build();

            // get the byte[] this AWS S3 object
            ResponseBytes<GetObjectResponse> objectBytes = s3.getObjectAsBytes(objectRequest);
            byte[] data = objectBytes.asByteArray();

            InputStream inputStream = new ByteArrayInputStream(data);
            return inputStream;
        }  catch (S3Exception e) {
            System.err.println(e.awsErrorDetails().errorMessage());
            System.exit(1);
        }
        // snippet-end:[s3.java2.getobjectdata.main]

        return null;
    }
}