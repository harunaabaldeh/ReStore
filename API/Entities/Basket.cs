namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; } = new List<BasketItem>();

        public void AddItem(Product product, int quantity)
        {
            if(Items.All(item => item.ProductId != product.Id))
            {
                Items.Add( new BasketItem{Product = product, Qunatity = quantity});
            }

            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
            if(existingItem  != null) existingItem.Qunatity += quantity;
        }

        public void RemoveItem(int productId, int qunatity)
        {
            var item = Items.FirstOrDefault(item => item.ProductId == productId);
            if(item == null) return;
            item.Qunatity -= qunatity;
            if(item.Qunatity == 0) Items.Remove(item);

        }
    }
}