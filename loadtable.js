loadtable = {};

loadtable.REFERRER = "https://coapi.sparcopen.org"
loadtable.KEYS = ['institution', 'membership_level', 'full_name', 'email'];
loadtable.KEYMAP = {}
loadtable.DATA = {}

loadtable.init = function() {
  loadtable.getData({
    callback: loadtable.renderData
  });
  $('#date').on('keyup', loadtable.dateFilter);
}

loadtable.getData = function(params) {
  let container = $("#sheet");
  let sid = container.attr("data-sheetid");
  let tid = container.attr("data-tab");
  let key = container.attr("data-key");

  let url = `https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/${tid}?key=${key}`;
  $.ajax({
    url: url,
    headers: {"referer": loadtable.REFERRER},
    dataType: "jsonp",
    success: function (data) {
      let keys = data.values.shift();
      for (let k of loadtable.KEYS) {
        let i = keys.indexOf(k);
        loadtable.KEYMAP[k] = i;
      }

      loadtable.DATA = data.values;
      params.callback();
    }
  });
}

loadtable.renderData = function() {
  let tbl = `<table style="width:100%"><thead>
      <th><b>Institution</b></th>
      <th><b>Membership Level</b></th>
      <th><b>Contact Name</b></th>
      <th><b>Contact Email</b></th>
    </thead>
    <tbody>`;

  for ( let r of loadtable.DATA ) {
    tbl += '<tr>';
    for ( let k of loadtable.KEYS) {
      let dk = r[loadtable.KEYMAP[k]];
      if (dk === undefined) { dk === ''; }
      if (k === 'institution' && r.source) {
        dk = `<a href="${r.source}">${dk}</a>`
      }
      tbl += `<td>${dk}</td>`;
    }
    tbl += '</tr>';
  }
  tbl += '</tbody></table>';
  $("#sheet").html(tbl);
}

loadtable.dateFilter = function() {
  $('#sheet tbody').children('tr').each(function() {
    let date = $("#date").val().trim();
    if (!date.length || date.length !== 4 || $(this).html().indexOf('>' + date + '<') !== -1) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

loadtable.init();