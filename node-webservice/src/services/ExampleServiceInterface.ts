import CRUDServiceInterface from '../lib/crud/CRUDServiceInterface';


/**
 * ExampleServiceInterface exposes additional operations for easier dependency 
 * injection.  It acts as an example for extending the CRUD interface.
 */
export default interface ExampleServiceInterface extends CRUDServiceInterface {
    root(odata: Record<string, any>): Promise<Array<Record<string, any>> | Record<string, any> | number>;
}
