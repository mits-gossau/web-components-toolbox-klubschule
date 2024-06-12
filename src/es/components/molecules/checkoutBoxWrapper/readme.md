# Checkout Info List

> Checkout Info List.

- [JIRA](https://jira.migros.net/browse/MIDUWEB-755)
- [Examples](../../pages/CheckoutBookingInformation.html)

## Attributes
- `status`: JSON with code and label `{'code': '1', 'label': 'Garantiert Durchgeführt'}`.  


## Markup Examples

### Example

```html
    <ks-m-info-list status="{'code': '1', 'label': 'Garantiert Durchgeführt'}">
        <div>
            <ks-a-heading tag="h3">Badminton GU Fortgeschrittene 6 TN</ks-a-heading>
            <div>
                <ul>
                    <li class="js-status">
                    </li>
                    <li>
                        <a-icon-mdx icon-name="Calendar" size="1.5rem"></a-icon-mdx>
                        <span>
                            22.4.2023 - 19.6.2023<br />
                            Mo, 18:00 - 20:00 Uhr
                        </span>
                    </li>
                    <li>
                        <a-icon-mdx icon-name="Location" size="1.5rem"></a-icon-mdx>
                        <span>
                            Hofwiesenstrasse 350<br />
                            8050 Zürich
                        </span>
                    </li>
                    <li>
                        <a-icon-mdx icon-name="ShoppingList" size="1.5rem"></a-icon-mdx>
                        <span>Kurs Nr. E_1198345</span>
                    </li>
                </ul>
                <div>
                    <ks-a-heading tag="h4">
                        Teilnehmer
                    </ks-a-heading>
                    <div>
                        <span><strong>Herr Hans Muster<br></strong></span>
                        <span>
                            Beispielstrasse 12, 3. OG<br>
                            8001 Zürich<br>
                            Schweiz
                        </span>
                    </div>
                    <div>
                        <span>
                            <strong>
                                E-Mail<br>
                                Phone<br>
                                Birthday<br><br>
                                Anmeldung als Geschenk
                            </strong>
                        </span>
                        <span>
                            hans.muster@beispiel.ch <br>
                            078 456 23 43 <br>
                            08.03.2002 <br><br>
                            Korrespondenz direkt zum/zur Teilnehmenden ab 09.03.2024.
                        </span>
                    </div>

                    <a href="https://www.migros.ch/en" target="_self">Angaben ändern</a>
                    <div>
                        <span>
                            <strong>
                                Kursgeld
                            </strong>
                        </span>
                        <span>
                            CHF 220.00
                        </span>
                    </div>
                    <div>
                        <span>
                            <strong>
                                E-book
                            </strong>
                            <br>
                            Speakout 2nd Edition Pre-Intermediate Workbook with key Bundle
                        </span>
                        <span>
                            CHF 12.30
                        </span>
                    </div>
                    <div>
                        <span>
                            <strong>
                                E-book
                            </strong>
                            <br>
                            Speakout 2nd Edition Pre-Intermediate Workbook with key Bundle
                        </span>
                        <span>
                            CHF 12.30
                        </span>
                    </div>
                    <a href="https://www.migros.ch/en" target="_self">Angaben ändern</a>
                    <hr />
                    <div>
                        <span>
                            <a-translation data-trans-key="Checkout.Total"></a-translation>
                        </span>
                        <div>
                            <span>244.60 CHF</span>
                            <span><a-translation data-trans-key="Checkout.Tax"></a-translation></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ks-m-info-list>
```

