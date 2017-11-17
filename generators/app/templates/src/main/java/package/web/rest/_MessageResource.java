package <%= packageName %>.web.rest;

import com.codahale.metrics.annotation.Timed;
import <%= packageName %>.domain.Jhi<%= rabbitMessageName %>;
import <%= packageName %>.service.stream.<%= rabbitMessageName %>Sink;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.messaging.Source;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@EnableBinding(Source.class)
public class <%= rabbitMessageName %>Resource {

    private MessageChannel channel;
    private <%= rabbitMessageName %>Sink <%= rabbitMessageNameNonUcFirst %>Sink;

    public <%= rabbitMessageName %>Resource(@Qualifier(Source.OUTPUT) MessageChannel channel, <%= rabbitMessageName %>Sink <%= rabbitMessageNameNonUcFirst %>Sink) {
        this.channel = channel;
        this.<%= rabbitMessageNameNonUcFirst %>Sink = <%= rabbitMessageNameNonUcFirst %>Sink;
    }

    @PostMapping("/messages")
    @Timed
    @ResponseStatus(HttpStatus.OK)
    public void createMessage(Jhi<%= rabbitMessageName %> jhi<%= rabbitMessageName %>) {
        channel.send(MessageBuilder.withPayload(jhi<%= rabbitMessageName %>).setHeader("title", jhi<%= rabbitMessageName %>.getTitle()).build());
    }

    @GetMapping("/messages")
    @Timed
    public List<Jhi<%= rabbitMessageName %>> getAllMessages() {
        return <%= rabbitMessageNameNonUcFirst %>Sink.getMessages();
    }
}
