import { /*ElementRef,*/ Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ExportFileService } from './export.service';

describe('ExportFileService', () => {
  let exportService: ExportFileService;
  let render: Renderer2;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [ExportFileService, { provide: Renderer2 }],
    });
    exportService = TestBed.get(ExportFileService);
    render = TestBed.get(Renderer2);
  });

  it('should be created', () => {
    expect(exportService).toBeTruthy();
  });
  it('should have svgToBase64', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    exportService.svg = svg;
    const expectedValue = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svg as Node));
    expect(exportService.svgToBase64()).toEqual(expectedValue);
  });

  it('should have encodedImage', () => {
    exportService.width = '10px';
    exportService.height = '10px';
    const spy = spyOn(exportService, 'svgToBase64');
    exportService.encodImage();
    expect(spy).toHaveBeenCalled();
  });

  it('should have loadImage', () => {
    spyOn(exportService, 'drawImageOnCanvas');
    const ExpectedFormat = 'jpg';
    exportService.loadImage(ExpectedFormat, name);
    expect(exportService.format).toEqual(ExpectedFormat);
    expect(exportService.drawImageOnCanvas).toHaveBeenCalled();
  });

  it('should have setCurrentRenderAndSVG', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const height = '1000px';
    const width = '1000px';
    exportService.setCurrentRenderAndSVG(render, svg, width, height);
    expect(exportService.render).toEqual(render);
    expect(exportService.svg).toEqual(svg);
    expect(exportService.height).toEqual(height);
    expect(exportService.width).toEqual(width);
  });
});
