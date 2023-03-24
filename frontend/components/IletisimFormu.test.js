import React from 'react';
import { getByPlaceholderText, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

test('hata olmadan render ediliyor', () => {
render(<IletisimFormu/>);
});

test('iletişim formu headerı render ediliyor', () => {
    //arrange
    render(<IletisimFormu/>);
    //act
    const h1 = screen.getByText("İletişim Formu")
    //assert
    expect(h1).toBeInTheDocument();

});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu/>);

    const userField = screen.getByLabelText("Ad");
    userEvent.type(userField,"asdf");
    const error = screen.getByTestId("error");
    expect(await error).toBeVisible();
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>);

    const btn = screen.getByRole("button");
    userEvent.click(btn);
    const errors = screen.getAllByTestId("error");
    expect(errors).toHaveLength(3);
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>);

    const userField = screen.getByLabelText("Ad");
    const secondField = screen.getByPlaceholderText("Mansız");
    
    userEvent.type(userField,"asdfg");
    userEvent.type(secondField,"asdfg");

    const btn = screen.getByRole("button");
    userEvent.click(btn);

    const error = screen.getAllByTestId("error");
    expect(await error).toHaveLength(1);

});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    render(<IletisimFormu/>);

    const email = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
    userEvent.type(email , "asfdf");
    const error = screen.getByTestId("error");
    expect(await error).toHaveTextContent("email geçerli bir email adresi olmalıdır.");

});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render(<IletisimFormu/>);

    const fieldName = screen.getByLabelText("Ad");
    userEvent.type(fieldName, "asdfgh");
    const email = screen.getByLabelText("Email*");
    userEvent.type(email, "coskun@gmail.com")

    const btn = screen.getByRole("button");
    userEvent.click(btn);

    const error = screen.getByTestId("error");
    expect(await error).toHaveTextContent("soyad gereklidir.");
    

});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    render(<IletisimFormu/>);
    const nameInput = screen.getByPlaceholderText(/İlhan/);
    const surnameInput = screen.getByPlaceholderText(/Mansız/);
    const emailInput = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/);
    userEvent.type(nameInput, "coskun");
    userEvent.type(surnameInput, "unen");
    userEvent.type(emailInput, "coskun@gmail.com");
    const submitButton = screen.getByText(/Gönder/);
    userEvent.click(submitButton);
    await waitFor(() => {
      const errorDiv = screen.queryAllByTestId("error");
      expect(errorDiv.length).toBe(0);
    });



});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu/>);
    userEvent.type(screen.getAllByPlaceholderText("İlhan"),"coskun");
    userEvent.type(screen.getAllByPlaceholderText("Mansız"), "unen");
    userEvent.type(screen.getAllByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    "coskune@gmail.com");
    userEvent.type(screen.getByText("Mesaj"), "odev tamam");
    userEvent.click(screen.getByRole("button"));
    
    
        const displayNameInput = screen.findByTestId("firstnameDisplay");
        const displaySurnameInput = screen.findByTestId("lastnameDisplay");
        const displayEmailInput = screen.findByTestId("emailDisplay");
        expect(await displayNameInput).toHaveTextContent("coskun");
        expect(await displaySurnameInput).toHaveTextContent("unen");
        expect(await displayEmailInput).toHaveTextContent("coskune@gmail.com");
   


});
