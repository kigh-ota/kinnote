declare namespace kintone {
    namespace events {
        function on(event: string, handler: Function): void;
    }
    function api(path: string, method: 'GET'|'POST'|'PUT'|'DELETE', params: any): Promise<any>;
}