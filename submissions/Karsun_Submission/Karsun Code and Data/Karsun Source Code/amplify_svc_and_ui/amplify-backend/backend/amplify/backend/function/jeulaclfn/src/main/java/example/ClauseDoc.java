package example;

import java.util.ArrayList;
import java.util.List;

public class ClauseDoc {

    public ClauseDoc() {
        this.sections = new ArrayList<>();
    }

    private List<DocSection> sections;

    public List<DocSection> getSections() {
        return sections;
    }

    public void setSections(List<DocSection> sections) {
        this.sections = sections;
    }

    @Override
    public String toString() {
        return "ClauseDoc{" +
                "sections=" + sections +
                '}';
    }
}
