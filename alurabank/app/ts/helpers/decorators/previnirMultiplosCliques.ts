//previne múltiplos cliques

export function previnirMultiplosCliques(milissegundos = 500) {

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const metodoOriginal = descriptor.value;

        let timer = 0;

        descriptor.value = function(...args: any[]) {
            
            // no load da página previne o default
            if(event) event.preventDefault();

            clearInterval(timer);
            timer = setTimeout(() => metodoOriginal.apply(this, args), milissegundos);
        }

        return descriptor;
    }
}