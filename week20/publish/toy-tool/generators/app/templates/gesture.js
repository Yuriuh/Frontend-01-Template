export function enableGesture(element) {
  let context = Object.create(null);
  let MOUSE_SYMBOL = Symbol('move');

  if (document.ontouchstart !== null)
    element.addEventListener('mousedown', () => {
      context[MOUSE_SYMBOL] = Object.create(null);
      start(event, context[MOUSE_SYMBOL]);
      let mousemove = (event) => {
        move(event, context[MOUSE_SYMBOL]);
      };

      let mouseend = (event) => {
        end(event, context[MOUSE_SYMBOL]);
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseend);
      };

      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseend);
    });

  element.addEventListener('touchstart', (event) => {
    for (const touch of event.changedTouches) {
      context[touch.identifier] = Object.create(null);
      start(touch, context[touch.identifier]);
    }
  });

  element.addEventListener('touchmove', (event) => {
    for (const touch of event.changedTouches) {
      move(touch, context[touch.identifier]);
    }
  });

  element.addEventListener('touchend', (event) => {
    for (const touch of event.changedTouches) {
      end(touch, context[touch.identifier]);
      delete context[touch.identifier];
    }
  });

  element.addEventListener('touchcancel', (event) => {
    for (const touch of event.changedTouches) {
      cancel(touch, context[touch.identifier]);
      delete context[touch.identifier];
    }
  });

  // tap
  // pan -- panstart panmove panend
  // flick
  // press -- pressstart pressend

  let start = (point, context) => {
    context.startX = point.clientX;
    context.startY = point.clientY;
    let e = new CustomEvent('start');
    element.dispatchEvent(
      Object.assign(e, {
        startX: point.clientX,
        clientX: point.clientX,
        startY: point.clientY,
        clientY: point.clientY,
      }),
    );
    context.moves = [];
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
    context.timeoutHandler = setTimeout(() => {
      if (context.isPan) {
        return;
      }
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      console.log('pressstart');
    }, 500);
  };

  let move = (point, context) => {
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;
    // console.log('move');

    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
      if (context.isPress) {
        console.log('presscancel');
        element.dispatchEvent(new CustomEvent('presscancel', {}));
      }
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      let e = new CustomEvent('panstart');
      element.dispatchEvent(
        Object.assign(e, {
          startX: context.startX,
          clientX: point.clientX,
          startY: context.startY,
          clientY: point.clientY,
        }),
      );
      console.log('panstart');
    }

    if (context.isPan) {
      context.moves.push({dx, dy, t: Date.now()});

      context.moves = context.moves.filter((record) => {
        return Date.now() - record.t < 300;
      });
      let e = new CustomEvent('pan');

      element.dispatchEvent(
        Object.assign(e, {
          startX: context.startX,
          clientX: point.clientX,
          startY: context.startY,
          clientY: point.clientY,
        }),
      );
      console.log('pan');
    }
  };

  let end = (point, context) => {
    if (context.isPan) {
      let dx = point.clientX - context.startX;
      let dy = point.clientY - context.startY;
      let record = context.moves[0];
      let speed = Math.sqrt(
        ((record.dx - dx) ** 2 + (record.dy - dy) ** 2) /
          (Date.now() - record.t),
      );
      // console.log(speed);
      let isFlick = speed > 2.5;

      if (isFlick) {
        console.log('flick');
        element.dispatchEvent(new CustomEvent('flick', {}));
      }
      let e = new CustomEvent('panend');
      element.dispatchEvent(
        Object.assign(e, {
          startX: context.startX,
          clientX: point.clientX,
          startY: context.startY,
          clientY: point.clientY,
          speed,
          isFlick,
        }),
      );
      console.log('panend');
    }
    if (context.isTap) {
      console.log('tap');
      element.dispatchEvent(new CustomEvent('tap'));
    }
    if (context.isPress) {
      element.dispatchEvent(new CustomEvent('pressend'));
      console.log('pressend');
    }
    clearTimeout(context.timeoutHandler);
  };

  let cancel = (point, context) => {
    console.log('cancel');
    element.dispatchEvent(new CustomEvent('cancel'));
    clearTimeout(context.timeoutHandler);
  };
}
