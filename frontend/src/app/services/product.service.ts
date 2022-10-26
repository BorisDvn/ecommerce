import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {ProductModelServer, serverResponse} from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private server: string = environment.SERVERURL;

  constructor(private http: HttpClient) {
  }

  getAllProducts(limitOfResults = 10): Observable<serverResponse> {
    return this.http.get<serverResponse>(this.server + 'products', {
      params: {
        limit: limitOfResults.toString()
      }
    });
  }

  getSingleProduct(id: number): Observable<ProductModelServer> {
    return this.http.get<ProductModelServer>(this.server + 'products/' + id);
  }

  getProductsFromCategory(catName: string): Observable<ProductModelServer[]> {
    return this.http.get<ProductModelServer[]>(this.server + 'products/category/' + catName);
  }

}
