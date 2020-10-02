import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jsonFlattenerUnflattener';
  selectedValue = 'Unflatten';
  formatted: any;

  form = new FormGroup({
    mode: new FormControl(''),
    json_content: new FormControl(''),
  });

  flatten(data) {
    var result = {};

    function recurse(cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            for (var i = 0, l = cur.length; i < l; i++)
            recurse(cur[i], prop + "[" + i + "]");
            if (l == 0) result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop + "." + p : p);
            }
            if (isEmpty && prop) result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
  }

  unflatten(data) {
    "use strict";
    if (Object(data) !== data || Array.isArray(data)) return data;
    var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder = {};
    for (var p in data) {
        var cur = resultholder,
            prop = "",
            m;
        while (m = regex.exec(p)) {
            cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
            prop = m[2] || m[1];
        }
        cur[prop] = data[p];
    }
    return resultholder[""] || resultholder;
  }

  onSubmit(){
    var result = '';
    switch(this.form.controls.mode.value){
      case 'flatten': 
        result = JSON.stringify(this.flatten(JSON.parse(this.form.controls.json_content.value)), null, "\t")
        break;

      case 'unflatten': 
        result = JSON.stringify(this.unflatten(JSON.parse(this.form.controls.json_content.value)), null, "\t")
        break;
    }

    this.formatted = result;
  }

  onCopy(){
    var containerid = 'formatted';
    var range = document.createRange();
    range.selectNode(document.getElementById(containerid));
    window.getSelection().removeAllRanges(); 
    window.getSelection().addRange(range); 
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    alert("Data copied");
  }
}
