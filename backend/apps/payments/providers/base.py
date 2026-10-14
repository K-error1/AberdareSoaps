from abc import ABC, abstractmethod

class BasePaymentProvider(ABC):
    @abstractmethod
    def initiate_payment(self, order, **kwargs):
        """Initiates a payment request (e.g. STK Push or Paystack Transaction)"""
        pass

    @abstractmethod
    def verify_payment(self, reference):
        """Verifies transaction status directly with the provider API"""
        pass
