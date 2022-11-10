import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { tap } from 'rxjs/operators';

@Injectable()
export class RFIDSocketService extends Socket implements OnDestroy {
  constructor(private route: ActivatedRoute) {
    super({ url: 'https://howtocal.com:8888', options: { query: { "id": route.snapshot.params.id } } });
    // super({ url: 'http://localhost:8888', options: { query: { "id": route.snapshot.params.id } } });
  }

  ngOnDestroy(): void {
    console.log('destroy');
  }

  getMessage() {
    return this.fromEvent('rfid');
  }

  getAvailableReader() {
    return this.fromEvent('avaiable_reader');
  }
}
