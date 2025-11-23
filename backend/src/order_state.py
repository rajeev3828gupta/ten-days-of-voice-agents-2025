"""Order state management for coffee shop barista agent."""

from dataclasses import dataclass, field, asdict
from typing import Optional


@dataclass
class CoffeeOrder:
    """Represents a coffee order with all required fields."""
    drinkType: Optional[str] = None
    size: Optional[str] = None
    milk: Optional[str] = None
    extras: list[str] = field(default_factory=list)
    name: Optional[str] = None

    def is_complete(self) -> bool:
        """Check if all required fields are filled."""
        return (
            self.drinkType is not None
            and self.size is not None
            and self.milk is not None
            and self.name is not None
        )

    def get_missing_fields(self) -> list[str]:
        """Get list of missing required fields."""
        missing = []
        if self.drinkType is None:
            missing.append("drinkType")
        if self.size is None:
            missing.append("size")
        if self.milk is None:
            missing.append("milk")
        if self.name is None:
            missing.append("name")
        return missing

    def to_dict(self) -> dict:
        """Convert order to dictionary for JSON serialization."""
        return asdict(self)
