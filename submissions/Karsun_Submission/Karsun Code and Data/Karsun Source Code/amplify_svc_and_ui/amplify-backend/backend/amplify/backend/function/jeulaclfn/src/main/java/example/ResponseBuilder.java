package example;

import java.util.HashMap;
import java.util.Map;

public class ResponseBuilder {

    private static final String ACCESS_CONTROL_ALLOW_HEADERS = "Access-Control-Allow-Headers";

    private static final String ACCESS_CONTROL_ALLOW_ORIGIN = "Access-Control-Allow-Origin";

    private int statusCode;

    private Map<String, String> headers = new HashMap<>();

    private String body;

    public ResponseBuilder headers(Map<String, String> headers) {
        this.headers = headers;
        return this;
    }

    public ResponseBuilder body(String body) {
        this.body = body;
        return this;
    }

    public ResponseBuilder ok() {
        this.statusCode = 200;
        return this;
    }

    public ResponseBuilder errorMsg(String body) {
        this.body = buildErrorMsg(body);
        return this;
    }

    public ResponseBuilder badRequest() {
        this.body = buildErrorMsg("Request could not be processed");
        this.statusCode = 400;
        return this;
    }

    public ResponseBuilder badRequest(String body) {
        this.body = buildErrorMsg(body);
        this.statusCode = 400;
        return this;
    }

    public ResponseBuilder unProcessableEntity() {
        this.body = buildErrorMsg("Request could not be processed");
        this.statusCode = 422;
        return this;
    }

    public ResponseBuilder unProcessableEntity(String body) {
        this.body = buildErrorMsg(body);
        this.statusCode = 422;
        return this;
    }

    public ResponseBuilder notFound() {
        this.body = buildErrorMsg("Resource not found");
        this.statusCode = 404;
        return this;
    }

    public ResponseBuilder notFound(String body) {
        this.body = buildErrorMsg(body);
        this.statusCode = 404;
        return this;
    }

    public ResponseBuilder internalError() {
        this.body = buildErrorMsg("Unknown error");
        this.statusCode = 500;
        return this;
    }

    public ResponseBuilder internalError(String body) {
        this.body = buildErrorMsg(body);
        this.statusCode = 500;
        return this;
    }

    private String buildErrorMsg(String body) {
        return "{\"message\": \"" + body + "\"}";
    }

    public ResponseBuilder originHeader(String domain) {
        headers.put(ACCESS_CONTROL_ALLOW_ORIGIN, domain);
        return this;
    }

    private void initDefaultHeaders() {
        headers.put(ACCESS_CONTROL_ALLOW_HEADERS, "Content-Type");
    }

    public ResponseClass build() {
        this.initDefaultHeaders();
        return new ResponseClass(statusCode, headers, body);
    }

}
