import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TouchpadComponent } from './touchpad/touchpad.component'
import { EditorComponent } from './editor/editor.component'
import { RouterModule, Routes } from '@angular/router';

/* Routing Module */
const appRoutes: Routes = [
  { path: '', redirectTo: '/editor', pathMatch: 'full'},
  { path: 'editor', component: EditorComponent },
  { path: 'touchpad-voice/:id', component: TouchpadComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports:    [ RouterModule ]
})

export class AppRoutingModule {}