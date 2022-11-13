import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RFIDSocketService } from 'src/app/shared/service/rfid-socket.service';

@Component({
  selector: 'app-rfid',
  templateUrl: './rfid.component.html',
  styleUrls: ['./rfid.component.scss'],
  providers: [RFIDSocketService]
})
export class RfidComponent implements OnInit {
  @ViewChild('rfid', { static: true }) rfidRef!: ElementRef;

  rfidValue!: string;

  constructor(private rFIDSocketService: RFIDSocketService) { }

  ngOnInit(): void {
    this.rfidRef?.nativeElement.focus();
  }

  onChange(event: any) {
    const rfid = event.target.value;
    this.rFIDSocketService.sendMessage(rfid);
    this.rfidValue = "";
  }

}
