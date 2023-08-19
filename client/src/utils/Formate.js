import Formatter from './Formatter';

const Formate = (value) => {
    const result = Formatter().format(value).slice(1);
    const sliced = result.slice(0, 1);

    if (sliced === '0') {
        return result.slice(1);
    } else {
        return Formatter().format(value).slice(1);
    }
}

export default Formate;