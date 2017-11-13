package <%= packageName %>.service.stream;

import <%= packageName %>.domain.JhiMessage;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.cloud.stream.messaging.Sink;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@EnableBinding(Sink.class)
public class MessageSink {

    private List<JhiMessage> jhiMessages = new ArrayList<>();

    @StreamListener(Sink.INPUT)
    public void saveMessage(JhiMessage jhiMessage) {
        jhiMessages.add(jhiMessage);
    }

    public List<JhiMessage> getMessages() {
        return jhiMessages;
    }
}
