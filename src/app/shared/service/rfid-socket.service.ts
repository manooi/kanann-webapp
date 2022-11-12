import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class RFIDSocketService extends Socket implements OnDestroy {
  constructor(private route: ActivatedRoute) {
    super({ url: 'https://www.howtocal.com:8888', options: { query: { "id": route.snapshot.params.id } } });
    // super({ url: 'https://128.199.124.170:8888', options: { query: { "id": route.snapshot.params.id } } });
    // super({ url: 'https://howtocal.com:2052', options: { query: { "id": route.snapshot.params.id } } });
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
