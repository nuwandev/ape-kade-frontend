import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { Toast } from "./component/toast/toast";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  ngOnInit(): void {
    initFlowbite();
  }
  protected readonly title = signal('ape-kade');
}
