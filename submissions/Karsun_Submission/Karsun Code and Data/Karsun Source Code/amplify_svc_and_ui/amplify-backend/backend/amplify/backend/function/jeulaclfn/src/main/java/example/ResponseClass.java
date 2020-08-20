/* Amplify Params - DO NOT EDIT
	STORAGE_EULACLASS_BUCKETNAME
Amplify Params - DO NOT EDIT */

package example;

import java.util.HashMap;
import java.util.Map;

public class ResponseClass {
    private int statusCode;
    private Map<String, String> headers = new HashMap<>();
    private String body;

    public ResponseClass(int statusCode, Map<String, String> headers, String body) {
        this.statusCode = statusCode;
        this.headers = headers;
        this.body = body;
    }
}