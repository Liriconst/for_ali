import React from "react";
import styles from "./DeliveryAndPay.module.scss";

export default class DeliveryAndPay extends React.Component<{}, {

}>{
    public constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div className={styles.pageDelivery}>
                <span className={styles.deliveryHeader}>Условия доставки</span>
                <span className={styles.deliveryTitle}>Территория доставки</span>
                <span className={styles.deliveryText}>Доставка осуществляется из магазина и со складов,</span>
                <span className={styles.deliveryText} style={{marginBottom: "15px"}}>расположенных в Санкт-Петербурге.</span>
                <span className={styles.deliveryTitle}>Режим работы</span>
                <span className={styles.deliveryText}>Заказы принимаются через веб-сайт prod-market.ru</span>
                <span className={styles.deliveryText}>24 часа в сутки, 7 дней в неделю, 365 дней в году.</span>
                <span className={styles.deliveryText}>Служба доставки работает с 07:00 до 21:00 Пн-Пт.</span>
                <span className={styles.deliveryText}>Расписание временных интервалов доставок:</span>
                <span className={styles.deliveryText}>7 дней в неделю с интервалами 09:00-11:00,</span>
                <span className={styles.deliveryText}>10:00-12:00, 11:00-13:00, 12:00-14:00, 13:00-15:00,</span>
                <span className={styles.deliveryText}>14:00-16:00, 15:00-17:00, 16:00-18:00, 17:00-19:00,</span>
                <span className={styles.deliveryText}>18:00-20:00, 19:00-21:00.</span>
                <span className={styles.deliveryText}>Вы можете выбрать любой другой доступный интервал</span>
                <span className={styles.deliveryText} style={{marginBottom: "15px"}}>доставки не далее 7 дней с момента совершения заказа.</span>
                <span className={styles.deliveryHeader}>Стоимость доставки</span>
                <span className={styles.deliveryText}>Стоимость доставки первого заказа - 49 рублей.</span>
                <span className={styles.deliveryText}>Доставка по Санкт-Петербургу по Ленинградской области:</span>
                <span className={styles.deliveryText}>При заказе от 2,000 до 4,999 руб. – 299 руб.</span>
                <span className={styles.deliveryText}>При заказе от 5,000 до 7,999 руб.- 249 руб.</span>
                <span className={styles.deliveryText}>При заказе от 8,000 руб.- Бесплатно.</span>
                <span className={styles.deliveryText}>К нестандартным заказам (более 30 кг) применяются корректировки:</span>
                <span className={styles.deliveryText}>+ 5 руб. за каждый дополнительный 1 кг</span>
                <span className={styles.deliveryText}>Минимальная сумма первого заказа - 1500 рублей</span>
                <span className={styles.deliveryText}>Минимальная сумма повторного заказа - 1500 рублей</span>
                <span className={styles.deliveryText} style={{marginBottom: "15px"}}>Есть вопросы? Свяжитесь с нами.</span>
                <span className={styles.deliveryHeader}>Оплата</span>
                <span className={styles.deliveryText}>Оплата возможна наличными или картой,</span>
                <span className={styles.deliveryText}>лично в магазине или курьеру при доставке.</span>
            </div>
        );
    }
}