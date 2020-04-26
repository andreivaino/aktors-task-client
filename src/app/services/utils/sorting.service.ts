import {Injectable} from '@angular/core';
import {SortingType} from '../../enums/SortingType';

@Injectable()
export class SortingService {

  constructor() {
  }

  sortOrderByOrderNumber(array): any[] {
    return array.sort((a, b) => {
      if (a.orderNumber < b.orderNumber) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortOrderByPrice(array): any[] {
    return array.sort((a, b) => {
      if (a.price < b.price) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortOrderByTransaction(array): any[] {
    return array.sort((a, b) => {
      if (a.transactionDate < b.transactionDate) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortOrderByClientLastName(array): any[] {
    return array.sort((a, b) => {
      if (a.client.lastName < b.client.lastName) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortOrderByClientFirstName(array): any[] {
    return array.sort((a, b) => {
      if (a.client.firstName < b.client.firstName) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortClientsByPersonalId(array): any[] {
    return array.sort((a, b) => {
      if (a.personalId < b.personalId) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortClientsByClientFirstName(array): any[] {
    return array.sort((a, b) => {
      if (a.firstName < b.firstName) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortClientsByClientLastName(array): any[] {
    return array.sort((a, b) => {
      if (a.lastName < b.lastName) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortClientsByClientCountry(array): any[] {
    return array.sort((a, b) => {
      if (a.country < b.country) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortProductsByBarcode(array): any[] {
    return array.sort((a, b) => {
      if (a.barcode < b.barcode) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortProductsByProductName(array): any[] {
    return array.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortProductsByReleaseDate(array): any[] {
    return array.sort((a, b) => {
      if (a.releaseDate < b.releaseDate) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortProductsByPrice(array): any[] {
    return array.sort((a, b) => {
      if (a.basePrice < b.basePrice) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  sortProductsByOrderNumber(array): any[] {
    const withOrderArray = [];
    const noOrderArray = [];
    for (const product of array) {
      if (product.order) {
        withOrderArray.push(product);
      } else {
        noOrderArray.push(product);
      }
    }
    withOrderArray.sort((a, b) => {
      if (a.order.orderNumber < b.order.orderNumber) {
        return -1;
      } else {
        return 1;
      }
    });
    return withOrderArray.concat(noOrderArray);
  }

  sortOrders(sortingType: SortingType, array): any[] {
    if (sortingType === SortingType.OrderNumber) {
      return this.sortOrderByOrderNumber(array);
    } else if (sortingType === SortingType.Price) {
      return this.sortOrderByPrice(array);
    } else if (sortingType === SortingType.Transaction) {
      return this.sortOrderByTransaction(array);
    } else if (sortingType === SortingType.ClientLastName) {
      return this.sortOrderByClientLastName(array);
    } else if (sortingType === SortingType.ClientFirstName) {
      return this.sortOrderByClientFirstName(array);
    }
  }

  sortClients(sortingType: SortingType, array): any[] {
    if (sortingType === SortingType.PersonalId) {
      return this.sortClientsByPersonalId(array);
    } else if (sortingType === SortingType.ClientFirstName) {
      return this.sortClientsByClientFirstName(array);
    } else if (sortingType === SortingType.ClientLastName) {
      return this.sortClientsByClientLastName(array);
    } else if (sortingType === SortingType.ClientCountry) {
      return this.sortClientsByClientCountry(array);
    }
  }

  sortProducts(sortingType: SortingType, array): any[] {
    if (sortingType === SortingType.Barcode) {
      return this.sortProductsByBarcode(array);
    } else if (sortingType === SortingType.ProductName) {
      return this.sortProductsByProductName(array);
    } else if (sortingType === SortingType.Price) {
      return this.sortProductsByPrice(array);
    } else if (sortingType === SortingType.ReleaseDate) {
      return this.sortProductsByReleaseDate(array);
    } else if (sortingType === SortingType.OrderNumber) {
      return this.sortProductsByOrderNumber(array);
    }
  }

}
