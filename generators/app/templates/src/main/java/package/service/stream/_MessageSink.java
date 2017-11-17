package <%= packageName %>.service.stream;

import <%= packageName %>.domain.Jhi<%= rabbitMessageName %>;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.cloud.stream.messaging.Sink;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@EnableBinding(Sink.class)
public class <%= rabbitMessageName %>Sink {

    private List<Jhi<%= rabbitMessageName %>> jhi<%= rabbitMessageName %>s = new ArrayList<>();

    @StreamListener(Sink.INPUT)
    public void saveMessage(Jhi<%= rabbitMessageName %> jhi<%= rabbitMessageName %>) {
        jhi<%= rabbitMessageName %>s.add(jhi<%= rabbitMessageName %>);
    }

    public List<Jhi<%= rabbitMessageName %>> getMessages() {
        return jhi<%= rabbitMessageName %>s;
    }
}
