# RxJs - Subjets event emitter
do I create a custom event emitter?

## node eventEmitter

Publish/Subscribe is a common pattern within JavaScript applications. The idea is that you have a publisher that emits events and you have consumers which register their interest in a given event. Typically you may see something like the following where you listen for a 'data' event and then the event emitter publishes data to it.


Due to changes to accommodate the ES7 Observable spec, the API has changed for observables:

- onNext -> `next`
- onError -> `error`
- onCompleted -> `complete`


```javascript 
      var emitter = new Emitter();

      function logData(data) {
            console.log('data: ' + data);
      }

      emitter.on('data', logData);

      emitter.emit('data', 'foo');
      // => data: foo

      // Destroy handler
      emitter.off('data', logData);
```

## Reactive Method

How might one implement this using the Reactive Extensions for JavaScript? Using an Rx.Subject will solve this problem easily. As you may remember, an Rx.Subject is both an Observer and Observable, so it handles both publish and subscribe.

```javascript 
      var subject = new Rx.Subject();

      var subscription = subject.subscribe(function (data) {
            console.log('data: ' + data);
      });

      subject.onNext('foo');
      // => data: foo
```

Now that we have a basic understanding of publish and subscribe through onNext and subscribe, let's put it to work to handle multiple types of events at once. First, we'll create an Emitter class which has three main methods, emit, on and off which allows you to emit an event, listen to an event and stop listening to an event.

```javascript 

      var hasOwnProp = {}.hasOwnProperty;

      function createName (name) {
            return "$" + name;
      }

      function Emitter() {
            this.subjects = {};
      }

      Emitter.prototype.emit = function (name, data) {
            var fnName = createName(name);
            this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
            this.subjects[fnName].onNext(data);
      };

      Emitter.prototype.on = function (name, handler) {
            var fnName = createName(name);
            this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
            this.subjects[fnName].subscribe(handler);
      };

      Emitter.prototype.off = function (name, handler) {
            var fnName = createName(name);
            if (this.subjects[fnName]) {
                  this.subjects[fnName].dispose();
                  delete this.subjects[fnName];
            }
      };

      Emitter.prototype.dispose = function () {
            var subjects = this.subjects;
            for (var prop in subjects) {
                  if (hasOwnProp.call(subjects, prop)) {
                        subjects[prop].dispose();
                  }
            }

            this.subjects = {};
      };
```

Then we can use it much as we did above. As the call to subscribe returns a subscription, we might want to hand that back to the user instead of providing an off method. So, we could rewrite the above where we call the on method to listen and we return a subscription handle to the user to stop listening.

```javascript 

      var hasOwnProp = {}.hasOwnProperty;

      function createName (name) {
            return "$" + name;
      }

      function Emitter() {
            this.subjects = {};
      }

      Emitter.prototype.emit = function (name, data) {
            var fnName = createName(name);
            this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
            this.subjects[fnName].onNext(data);
      };

      Emitter.prototype.listen = function (name, handler) {
            var fnName = createName(name);
            this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
            return this.subjects[fnName].subscribe(handler);
      };

      Emitter.prototype.dispose = function () {
            var subjects = this.subjects;
            for (var prop in subjects) {
                  if (hasOwnProp.call(subjects, prop)) {
                        subjects[prop].dispose();
                  }
            }

            this.subjects = {};
      };
```

Now we can use this to rewrite our example such as the following:

```javascript 
      var emitter = new Emitter();

      var subcription = emitter.listen('data', function (data) {
            console.log('data: ' + data);
      });

      emitter.emit('data', 'foo');
      // => data: foo

      // Destroy the subscription
      subscription.dispose();
```

```HTML
      <script src="https://unpkg.com/@reactivex/rxjs@5.0.0/dist/global/Rx.js"></script>
      <!-- version 5.0.0 -->
```

## eventemitter

Pub/Sub es como un Observer pattern pero sin destinatario específico.
Igual al  eventemiter de N0ode. El intermediario se llama `message broker` or `event bus`. 

Un eventemiiter hecho con rxjs!!!
- [RxEmitter](https://github.com/a-jie/RxEmitter)

- [TUTORIAL-using-a-subject-as-an-event-bus](https://egghead.io/lessons/rxjs-using-a-subject-as-an-event-bus)


- [post original](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/howdoi/eventemitter.md)
- [oficial docs](http://reactivex.io/rxjs/manual/overview.html#introduction)
- [referencias](https://www.learnrxjs.io/)
- [ayuda visual](https://rxmarbles.com/)