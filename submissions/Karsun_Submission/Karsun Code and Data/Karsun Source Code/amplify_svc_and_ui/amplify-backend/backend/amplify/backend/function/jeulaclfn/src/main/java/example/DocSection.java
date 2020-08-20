package example;

import java.util.ArrayList;
import java.util.List;

public class DocSection {
    private String header;
    private List<String> clauses;
    private List<String> predictions;

    public DocSection() {
        this.clauses = new ArrayList<>();
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public List<String> getClauses() {
        return clauses;
    }

    public void setClauses(List<String> clauses) {
        this.clauses = clauses;
    }

    public List<String> getPredictions() {
        return predictions;
    }

    public void setPredictions(List<String> predictions) {
        this.predictions = predictions;
    }

    @Override
    public String toString() {
        return "DocSection{" +
                "header='" + header + '\'' +
                ", clauses=" + clauses +
                '}';
    }
}
