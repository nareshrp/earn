import { Component, OnInit } from '@angular/core';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isFolded: boolean = false;

  constructor(private themeService: ThemeConstantService) { }

  ngOnInit(): void {
  }

  toggleFold(val: any) {
    console.log("val", val);
    this.themeService.isMenuFoldedEvent.next(val);
  }

}
