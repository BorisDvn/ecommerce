import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  products: ProductResponseModel[] = [];
  private server: string = environment.SERVERURL;

  constructor(private http: HttpClient) {
  }

  getSingleOrder(orderId: number) {
    return this.http.get<ProductResponseModel[]>(`${this.server}orders/${orderId}`).toPromise();
  }
}

interface ProductResponseModel {
  id: number;
  title: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}

