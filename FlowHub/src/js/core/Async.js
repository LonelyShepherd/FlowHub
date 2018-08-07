import Component from "../components/Component";

let notifier = Component.notify;

class Async {
  static post(options) {
    notifier('working');
    $.ajax({
      url: options.url,
      method: 'POST',
      data: options.data,
      processData: false,
      contentType: false,
      mimeType: 'multipart/form-data'
    }).done(data => {
      notifier('success', options.successMessage);
      options.onDone && options.onDone(data);
    }).fail(() => {
      notifier('error', 'Something went terribly wrong. Sorry...');
    });
  }
}

export default Async;