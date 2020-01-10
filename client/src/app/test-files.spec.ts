import { HttpClient } from '@angular/common/http';

export interface HttpClientSpy extends HttpClient {
    get: jasmine.Spy;
    post: jasmine.Spy;
    delete: jasmine.Spy;
    put: jasmine.Spy;
}
