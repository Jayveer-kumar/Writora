function asyncWrap(fun){
    return function (req,res,next){
        fun(req,res,next).catch(next);
    }
}
export default asyncWrap;

// const asyncWrap = (fn) => {
//    return (req, res, next) => {
//       Promise.resolve(fn(req, res, next)).catch(next);
//    };
// };

