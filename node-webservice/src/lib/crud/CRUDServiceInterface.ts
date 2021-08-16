
/**
 * CRUDServiceInterface exposes all relevant CRUD operations for easier
 * dependency injection.
 */
export default interface CRUDServiceInterface {
    read(id: number, odata: Record<string, string>): Promise<Record<string, any>>;
    update(id: number, data: Record<string, any>, lastModified: string): Promise<Record<string, any>>;
    edit(id: number, data: Record<string, any>, lastModified: string): Promise<Record<string, any>>;
    create(data: Record<string, any>): Promise<Record<string, any>>;
    delete(id: number, lastModified: string): Promise<Record<string, any>>;
}
