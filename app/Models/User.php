<?php

namespace App\Models;

use Laravel\Passport\HasApiTokens;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Class User
 * @package App\Models
 * @property int $id
 * @property string $full_name
 * @property string $email
 * @property string $created_at
 * @property Group[] $ownerGroups
 * @property Group[] $subscribedGroups
 * @property Message[] $messages
 */
class User extends Authenticatable
{
    use HasApiTokens, Authorizable;

    /**
     * User groups.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function ownerGroups()
    {
        return $this->hasMany('App\Models\Group', 'owner_id');
    }

    /**
     * User subscribed groups.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function subscribedGroups()
    {
        return $this->belongsToMany('App\Models\Group');
    }

    /**
     * User Messages.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function messages()
    {
        return $this->hasMany('App\Models\Message', 'user_id');
    }
}
