import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BlindCreatorComponent } from "./blind-creator/blind-creator.component";
import { EditorComponent } from "./editor/editor.component";
import { TouchpadComponent } from "./touchpad/touchpad.component";

/* Routing Module */
const appRoutes: Routes = [
  { path: "", pathMatch: "full", component: EditorComponent},
  { path: "touchpad-voice/:id", component: TouchpadComponent },
  { path: "create-map", component: BlindCreatorComponent },
  { path: ":id", redirectTo: "touchpad-voice/:id" },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(appRoutes),
  ],
})

export class AppRoutingModule {}
