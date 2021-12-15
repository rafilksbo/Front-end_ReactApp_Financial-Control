import {format} from 'date-fns'
import { ptBR } from 'date-fns/locale'



export function formatToMoney(value){
    const valueAsNumber = new Number(value)

    return valueAsNumber.toLocaleString('pt-br',{
        style:'currency', currency:'BRL'
    })
}

export function formatToDate(date){
    const generateDate = new Date(date)

    return format(generateDate, 'dd/MM/yyyy')
 }

 export function formatToWeek(date){
        return format(date, 'eee', {
            locale: ptBR
        })
 }




