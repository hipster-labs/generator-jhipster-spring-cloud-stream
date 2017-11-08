package <%= packageName %>.domain;

public class JhiMessage {

    private String title;

    private String body;

    public JhiMessage() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
}
