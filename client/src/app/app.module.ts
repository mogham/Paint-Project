import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatExpansionModule, MatGridListModule, MatSliderModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ColorPickerModule } from './components/color-picker/color-picker.module';
import { DrawingViewComponent } from './components/drawing-view/drawing-view.component';
import { ExportDrawComponent } from './components/export-draw/export-draw.component';
import { GridComponent } from './components/grid/grid.component';
import { NewDrawCreationComponent } from './components/new-draw-creation/new-draw-creation.component';
import { OpenDrawComponent } from './components/open-draw/open-draw.component';
import { SaveDrawComponent } from './components/save-draw/save-draw.component';
import { AerosolComponent } from './components/toolbar-view/aerosol/aerosol.component';
import { ColorToolComponent } from './components/toolbar-view/color-tool/color-tool.component';
import { EllipseComponent } from './components/toolbar-view/ellipse/ellipse.component';
import { EraserComponent } from './components/toolbar-view/eraser/eraser.component';
import { FountainPenComponent } from './components/toolbar-view/fountain-pen/fountain-pen.component';
import { LineComponent } from './components/toolbar-view/line/line.component';
import { MagnetComponent } from './components/toolbar-view/magnet/magnet/magnet.component';
import { PaintBrushComponent } from './components/toolbar-view/paint-brush/paint-brush.component';
import { PaintBucketComponent } from './components/toolbar-view/paint-bucket/paint-bucket.component';
import { PenComponent } from './components/toolbar-view/pen/pen.component';
import { PencilComponent } from './components/toolbar-view/pencil/pencil.component';
import { PipetteComponent } from './components/toolbar-view/pipette/pipette.component';
import { PolygonComponent } from './components/toolbar-view/polygon/polygon.component';
import { RectangleComponent } from './components/toolbar-view/rectangle/rectangle.component';
import { SelectComponent } from './components/toolbar-view/select/select.component';
import { StampComponent } from './components/toolbar-view/stamp/stamp.component';
import { TextComponent } from './components/toolbar-view/text/text.component';
import { VerifyCreateNewDrawComponent } from './components/verify-create-new-draw/verify-create-new-draw.component';
import { VerifyExportDrawComponent } from './components/verify-export-draw/verify-export-draw.component';
import { VerifyOpenDrawComponent } from './components/verify-open-draw/verify-open-draw.component';
import { VerifySaveDrawComponent } from './components/verify-save-draw/verify-save-draw.component';
import { WelcomeModalComponent } from './components/welcome-modal/welcome-modal.component';
import { MaterialModule } from './material/material.module';
@NgModule({
  declarations: [
    DrawingViewComponent,
    PaintBrushComponent,
    PencilComponent,
    FountainPenComponent,
    AerosolComponent,
    PenComponent,
    RectangleComponent,
    EllipseComponent,
    PolygonComponent,
    LineComponent,
    SelectComponent,
    TextComponent,
    EraserComponent,
    PipetteComponent,
    StampComponent,
    PaintBucketComponent,
    NewDrawCreationComponent,
    ColorToolComponent,
    WelcomeModalComponent,
    VerifyCreateNewDrawComponent,
    PaintBrushComponent,
    GridComponent,
    SaveDrawComponent,
    VerifySaveDrawComponent,
    OpenDrawComponent,
    ExportDrawComponent,
    VerifyOpenDrawComponent,
    VerifyExportDrawComponent,
    MagnetComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ColorPickerModule,
    BrowserAnimationsModule,
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectFilterModule,
    MatGridListModule,
    MatSliderModule,
    MatButtonModule,
    MatExpansionModule,
  ],
  entryComponents: [
    NewDrawCreationComponent,
    VerifyCreateNewDrawComponent,
    SaveDrawComponent,
    VerifyOpenDrawComponent,
    OpenDrawComponent,
    VerifySaveDrawComponent,
    OpenDrawComponent,
    VerifyOpenDrawComponent,
    WelcomeModalComponent,
    ExportDrawComponent,
    VerifyExportDrawComponent,
  ],
  bootstrap: [DrawingViewComponent],
})
export class AppModule {

}
