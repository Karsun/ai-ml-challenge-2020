/* Amplify Params - DO NOT EDIT
	STORAGE_EULACLASS_BUCKETNAME
Amplify Params - DO NOT EDIT */

package example;
        
public class RequestClass {
     String fileName;

     public String getFileName() {
         return fileName;
     }

     public void setFileName(String fileName) {
         this.fileName = fileName;
     }

     public RequestClass(String fileName) {
        this.fileName = fileName;
    }

    public RequestClass() {
    }

    @Override
    public String toString() {
        return "RequestClass{" +
                "fileName='" + fileName + '\'' +
                '}';
    }
}