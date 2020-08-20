package example;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class ClauseDocSaxParser extends DefaultHandler  {

    private ClauseDoc clauseDoc;
    private String elementValue;

    private DocSection section;
    private String currentClause = null;
    private String currentListItem = null;

    @Override
    public void characters(char[] ch, int start, int length) throws SAXException {
        elementValue = new String(ch, start, length);
    }

    @Override
    public void startDocument() throws SAXException {
        clauseDoc = new ClauseDoc();
    }

    @Override
    public void startElement(String uri, String lName, String qName, Attributes attr) throws SAXException {
        switch (qName) {
            case "h1":
                if(section != null) {
                    clauseDoc.getSections().add(section);
                }
                section = new DocSection();
                break;
            case "p":
                String pClass = attr.getValue("class");
                if(pClass != null && pClass.equalsIgnoreCase("body_Text")) {
                    currentClause = "";
                } else if(pClass != null && pClass.equalsIgnoreCase("list_Paragraph")) {
                    currentListItem = "";
                } else {
                    currentClause = null;
                }
                break;
        }
    }

    @Override
    public void endElement(String uri, String localName, String qName) throws SAXException {
        switch (qName) {
            case "h1":
                if(section != null) {
                    section.setHeader(elementValue);
                }
                break;
            case "p":
                if(currentClause != null && section != null) {
                    if(elementValue != null && elementValue.trim().length() > 0) {
                        currentClause = elementValue.trim();
                        section.getClauses().add(currentClause);
                    }
                }
                if(currentListItem != null && section != null) {
                    if(elementValue != null && elementValue.trim().length() > 0) {
                        currentListItem = elementValue.trim();
                        section.getClauses().add(currentListItem);
                    }
                }
                break;
        }
    }

    public ClauseDoc getClauseDoc() {
        return clauseDoc;
    }
}
